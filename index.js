const express = require("express");
const bodyParser = require("body-parser");
const dataStorage = require("./dataStorage");
const utilities = require("./utilities");

let data = [];
data = dataStorage();

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
  .post((req, res, next) => {
    let rules = {
      firstName: {
        required: true,
        minLength: 3,
        onlyLetter: true,
      },
      lastName: {
        required: true,
        minLength: 3,
        onlyLetter: true,
      },
      birthDate: {
        required: true,
        date: true,
      },
      phoneNumber: {
        required: true,
        phoneNumber: true,
      },
      email: {
        required: true,
        email: true,
      },
      address: {
        required: true,
        minLength: 20,
      },
    };
    utilities.requestValidator(req, res, next, rules);
  })
  .post(function (req, res, next) {
    let newItem = {
      id: data.length + 1,
      ...req.body,
    };

    data.push(newItem);
    res.send({
      isValid: true,
      message: "Successful!",
      newPerson: newItem,
    });
  })
  .delete(function (req, res, next) {
    data = [];
    res.send({ status: "Successful", message: "Persons cleared", data: data });
  })
  .all(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
  });

router
  .route("/person/:id")
  .get(function (req, res, next) {
    let id = req.params["id"] - 1;

    if (data.filter((person) => person["id"] === id + 1).length === 1) {
      res.send(data[id]);
    } else {
      res.status(404).send("Sorry, the requested object was not found!");
    }
  })
  .all(function (req, res, next) {
    res.status(404).send("Unavailable request!");
  });

const app = express().use("/api", router).listen(3000);
