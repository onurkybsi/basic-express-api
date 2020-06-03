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

    let searchedObject = utilities.findObjectById(id, data);
    if (searchedObject.isItFound) {
      res.status(200).send(searchedObject.object);
    } else {
      res.status(404).send(searchedObject.message);
    }
  })
  .delete(function (req, res, next) {
    let id = req.params["id"] - 1;

    let objectToDelete = utilities.findObjectById(id, data);
    if (objectToDelete.isItFound) {
      data.splice(id, 1);

      res.status(200).send({
        isItDeleted: true,
        message: "The person was deleted",
        data: data,
      });
    } else {
      res.status(404).send(objectToDelete.message);
    }
  })
  .all(function (req, res, next) {
    res.status(400).send("Unavailable request!");
  });
//#endregion

//#region all other points
router.route("*").all(function (req, res, next) {
  res.status(400).send("Unavailable request!");
});
//#endregion

const app = express().use("/api", router).listen(3000);
