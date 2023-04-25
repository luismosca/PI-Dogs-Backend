const { Router } = require('express');
const router = Router();

const { getDog, getDogs } = require("../controllers/dogsController");

// creo las rutas de los dogs y dog por ID
router.get("/", getDogs);

router.get("/:id", getDog);

module.exports = router;
