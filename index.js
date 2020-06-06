const express = require("express");
const bodyParser = require("body-parser");
const data = require("./dataStorage");
const utilities = require("./utilities");

let dataStorage = [];
dataStorage = data();

updataDataStorage = (id, newValues) => {
  let toBeUpdated = utilities.findObjectById(id, dataStorage);
  let toBeUpdatedKeys = Object.keys(newValues);

  if (toBeUpdated.isItFound) {
    for (const prop in toBeUpdated.object) {
      if (toBeUpdatedKeys.some((toBeUpdatedKey) => toBeUpdatedKey === prop)) {
        toBeUpdated.object[prop] = newValues[prop];
      }
    }

    return {
      isSuccessful: true,
      object: toBeUpdated.object,
    };
  }

  return {
    isSuccessful: false,
    object: null,
  };
};

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
    res.send(dataStorage);
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
      id: dataStorage.length + 1,
      ...req.body,
    };

    dataStorage.push(newItem);
    res.status(201).send({
      isValid: true,
      message: "Successful!",
      newPerson: newItem,
    });
  })
  .delete(function (req, res, next) {
    dataStorage = [];
    res.status(204).send({
      status: "Successful",
      message: "Persons cleared",
      dataStorage: dataStorage,
    });
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

    let searchedObject = utilities.findObjectById(id, dataStorage);
    if (searchedObject.isItFound) {
      res.status(200).send(searchedObject.object);
    } else {
      res.status(404).send(searchedObject.message);
    }
  })
  .put(function (req, res, next) {
    let rules = {
      firstName: {
        required: false,
        minLength: 3,
        onlyLetter: true,
      },
      lastName: {
        required: false,
        minLength: 3,
        onlyLetter: true,
      },
      birthDate: {
        required: false,
        date: true,
      },
      phoneNumber: {
        required: false,
        phoneNumber: true,
      },
      email: {
        required: false,
        email: true,
      },
      address: {
        required: false,
        minLength: 20,
      },
    };

    utilities.requestValidator(req, res, next, rules);
  })
  .put(function (req, res, next) {
    let id = req.params["id"] - 1;

    let updatedData = updataDataStorage(id, req.body);
    if (updatedData.isSuccessful) {
      res.status(200).send({
        isSuccesful: updatedData.isSuccessful,
        message: "The person updated!",
        object: updatedData.object,
      });
    } else {
      res.status(404).send({
        isSuccessful: false,
        message: "Failed to update the person!",
        object: null,
      });
    }
  })
  .delete(function (req, res, next) {
    let id = req.params["id"] - 1;

    let objectToDelete = utilities.findObjectById(id, dataStorage);
    if (objectToDelete.isItFound) {
      dataStorage.splice(id, 1);

      res.status(200).send({
        isItDeleted: true,
        message: "The person was deleted",
        dataStorage: dataStorage,
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
