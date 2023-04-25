const { Dog, Temperament } = require('../db');
const { getAllDogs } = require('../Utils/utilities');
const { Op } = require('sequelize');
const {API_KEY, API_URL} = process.env
const axios = require('axios');

const getDogs = async (req, res) => {
  let { name } = req.query;
  
  if (name) {
    name = name.split(" ").join("-").toLowerCase();
    //Busco primero en la BD
    const nameDog = await Dog.findAll({
      where: {
          name: {
              [Op.iLike]: `%${name}%` //Usamos el operador iLike para validar nombre ingresado
          },
      },
      include: [{
          model: Temperament,
          through: {
              attributes: [],
          }
      
      }],
    })
    
    if(!nameDog.length) {
      let allSearchedDogs = []
      // Busco en la API
      const allDogsByName = await axios.get(`${API_URL}breeds/search?q=${name}`)
      
      //busco todos los dogs de la API
      const allDogsFromAPI = await axios.get('https://api.thedogapi.com/v1/breeds');
      allDogsByName.data.map(dog => {
        const imageID = dog.reference_image_id
        //busco la imagen de cada uno de los dogs
        const imagen = allDogsFromAPI.data.filter(function(dog){
          return dog.image.id === imageID
        })
        //busco la URL de la imagen de los dogs
        if (imagen.length) {
          let imgUrl = imagen[0].image.url
          //guardo en results todos los datos pedidos de los dogs
          const results = {
            id: dog.id,
            name: dog.name,
            height: dog.height.metric,
            weight: dog.weight.metric,
            life_span: dog.life_span,
            temperament: dog.temperament,
            image: imgUrl
            }
          
          allSearchedDogs.push(results)
        }
      })
                
      try {
        if (allSearchedDogs.length){
          res.status(200).json(allSearchedDogs);
        } else {
          res.status(400).send('Dog not found')
        }
      } catch (error) {
        res.send(error.message)
      }
      
    } else {
      return res.status(200).send(nameDog)
    }

  } else {
    
    let results = await getAllDogs()
    res.status(200).json(results);
    
  }
};
//busco lo temperamenteros de los dogs
const getDog = async (req, res) => {
  const { id } = req.params;
  const temperaments = {
    model: Temperament,
    attributes: ['name'],
    through: {
      attributes: []
    }
  }
  
try {
  const regex = /([a-zA-Z]+([0-9]+[a-zA-Z]+)+)/

  if (regex.test(id)){
    //Por if true en DB con id: 
    const dogInDB = await Dog.findOne({ where: {id},
      include: {model: Temperament, attributes: ['name'],
      through: {attributes: []}}})
      let d = dogInDB
      const information = {
          id: d.id,
          name: d.name,
          image: d.image,
          height: d.height,
          weight: d.weight,
          life_span: d.life_span,
          temperament: d.temperaments.map(p => p.name).join(", ")
      }
      return res.json(information)
    
  }else {
    //bysco dog en API por ID
    const dogInAPI = await axios.get(`${API_URL}breeds/${id}?key=${API_KEY}`)
    //tomo la imagen del dog
    const imageID = dogInAPI.data.reference_image_id
    //busco todos los dogs en la API
    const allDogsFromAPI = await axios.get('https://api.thedogapi.com/v1/breeds');
    //tomo la imagen de cada uno de los dogs
    const imagen = allDogsFromAPI.data.filter(function(image){
      return image.image.id === imageID
    })
    //tomo la URL de la imagen del dog
    let imgUrl = imagen[0].image.url
    //guardo en resultado los datos de los dogs
    const resultado = {
      id: dogInAPI.data.id,
      name: dogInAPI.data.name,
      height: dogInAPI.data.height.metric,
      weight: dogInAPI.data.weight.metric,
      life_span: dogInAPI.data.life_span,
      temperament: dogInAPI.data.temperament,
      image: imgUrl
      }

    //retorno el resultado  
    if (resultado){
      res.json(resultado)
    }
  }
} catch (error) {
  res.status(404).json({error: error.message})
}

};

module.exports = {
  getDogs,
  getDog,
};
