const { Dog, Temperament } = require('../db');
const axios = require('axios');

// busco los Dogs de la DB
const getDBdogs = async () => {
  const dbDogs = await Dog.findAll({
    include: {
      model: Temperament,
      attributes: ["name"],
      through: {
        attributes: [], //traer mediante los atributos del modelo
      },
    },
  })
  
  // determino que son los dogs de la BD
  const dbDogsClean = dbDogs.map((dog) => {

  //el array de objetos de los temps. en un string de ellos.
  const temperamentString = dog.temperaments.map(item => item.name).join(", "); 
    
    return {
      id: dog.id,
      name: dog.name,
      image: dog.image,
      weight: dog.weight,
      origin: "db",
      temperament: temperamentString,
    };
  });
  
  return dbDogsClean;
};

// busco los dogs de la API
const getAPIdogs = async () => {
const apiDogs = await axios.get('https://api.thedogapi.com/v1/breeds');
// determino que son los dogs de la API
const apiDogsClean = apiDogs.data.map((dog) => {
    return {
      id: dog.id,
      name: dog.name,
      image: dog.image.url,
      weight: dog.weight.metric,
      origin: "api",
      temperament: dog.temperament,
    };
  });
  return apiDogsClean;
};

// retorno todos los dogs de la BD y de la API
const getAllDogs = async () =>{
const dbDogs = await getDBdogs();
const apiDogs = await getAPIdogs();
return [...dbDogs, ...apiDogs];
}

module.exports = { getAllDogs };
