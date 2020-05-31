exports.requestBodyExamine = (req, res, next, requiredKeys) => {
  let keys = Object.keys(req.body);

  if (keys.length !== requiredKeys.length) {
    res.status(404).send("Soryy request body is not true!");
  }

  requiredKeys.forEach((key) => {
    if (!keys.includes(key)) {
      res.status(404).send(`Soryy ${key} can't find!`);
    }
  });

  next();
};
