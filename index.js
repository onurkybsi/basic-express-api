const express = require("express");
const bodyParser = require("body-parser");
const dataStorage = require("./dataStorage");
const utilities = require("./utilities");

let data = [];
data = dataStorage();

const router = express.Router();
router.use(bodyParser());

//#region Hello point
router.route("").get(function (req, res, next) {
  res.status(200).send({
    author: "Onur Kayabasi",
    message: "Hello World!",
  });
});
//#endregion

//#region /person
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
    res.status(201).send({
      isValid: true,
      message: "Successful!",
      newPerson: newItem,
    });
  })
  .delete(function (req, res, next) {
    data = [];
    res
      .status(204)
      .send({ status: "Successful", message: "Persons cleared", data: data });
  })
  .all(function (req, res, next) {
    res.status(400).send("Unavailable request!");
  });
//#endregion

//#region /person/:id
router
  .route("/person/:id")
  .get(function (req, res, next) {
    let id = req.params["id"] - 1;

    if (Number.isNaN(id))
      res.status(400).send("Sorry, the id value must be an integer!");

    if (data.filter((person) => person["id"] === id + 1).length === 1) {
      res.send(data[id]);
    } else {
      res.status(404).send("Sorry, the requested object was not found!");
    }
  })
  .all(function (req, res, next) {
    res.status(400).send("Unavailable request!");
  });
//#endregion

router.route("*").all(function (req, res, next) {
  res.status(400).send("Unavailable request!");
});

const app = express().use("/api", router).listen(3000);
