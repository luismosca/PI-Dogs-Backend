//  Funcion para validar los datos de los Dogs

const validateDog = (req, res, next) => {
  const { image, name, weight } = req.body;
  if (!image) return res.status(400).json({ error: "Missing Image" });
  if (!name) return res.status(400).json({ error: "Missing Name" });
  if (!weight) return res.status(400).json({ error: "Missing Weight" });
  next();
}


module.export ={ validateDog };
