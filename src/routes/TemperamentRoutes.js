const { Router } = require('express');
const axios = require("axios");
const { Dog, Temperament } = require('../db');
const router = Router();

router.get('/', async (req, res) => { 
  let arrayTemperaments = [];
  let arrayFinal = [];

  try {
    //Busco todos los Dogs de la API
    const apiDogs = await axios.get('https://api.thedogapi.com/v1/breeds');
    //Guardo todos los temperamentos
    const temperaments = apiDogs.data.map((t) => t.temperament)
    //Guardo en un array los temperamentos por separado en strings de cada uno de ellos
    for (let i=0; i<temperaments.length; i++){
      if (temperaments[i]) {
        arrayTemperaments = temperaments[i].split(', ')
      }
      for (let j=0; j<arrayTemperaments.length; j++){
        arrayFinal.push(arrayTemperaments[j])
        arrayFinal = arrayFinal.sort()
      }
      arrayTemperaments = []
    }
    //Saco del array de temperamentos todos los que estan repetidos y me quedo con los unicos distintos
    const uniqueTemperaments = Array.from(new Set(arrayFinal))
    
    //Me fijo si estan ya guardados los temperamewntos en la tabla
    const allTemperaments = await Temperament.findAll()
    //Convierto los temperamentos del array en un array de objetos de los temperamentos
    const objTemperaments = uniqueTemperaments.map((t) => {
      return { name: t }
    });
    //Pregunto si hay registros en la table de Temperamentos, si no hay los guardo a todos
    if (allTemperaments.length === 0){
      await Temperament.bulkCreate(objTemperaments)
    }
    //Si habia Temperamentos en la tabla los busco a todos y los retorno
    const temperamentsDB = await Temperament.findAll()
    res.status(200).send(temperamentsDB)
    
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router;
