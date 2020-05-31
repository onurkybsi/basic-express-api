const express = require("express");
const bodyParser = require("body-parser");
const dataStorage = require("./dataStorage");

let data = dataStorage();

requestBodyExamine = (req, res, next, requiredKeys) => {
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

const router = express.Router();
router.use(bodyParser());

router.route("").get(function (req, res, next) {
  res.send({
    author: "Onur Kayabasi",
    message: "Hello World!",
  });
});

router
  .route("/person")
  .get(function (req, res, next) {
    res.send(data);
  })
  .post((req, res, next) => requestBodyExamine(req, res, next, ["firstName", "lastName", "birthDate", "email"] ))
  .post(function (req, res, next) {
    res.send(req.body);
  })
  .all(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
  });

router.route;

router.route("/person/:id").get(function (req, res, next) {
  res.send(data[req.params["id"]]);
});

const app = express().use("/api", router).listen(3000);
