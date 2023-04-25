const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const dogRouter = require('./DogRoutes');
const temperamentRoute = require('./TemperamentRoutes');
const dogcreateRoute = require('./DogcreateRoute');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/breeds', dogRouter);
router.use('/temperaments', temperamentRoute);
router.use('/dogcreate', dogcreateRoute)

module.exports = router;
