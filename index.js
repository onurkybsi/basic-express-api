const express = require("express");
const bodyParser = require("body-parser");
const dataStorage = require("./dataStorage");
const utilities = require("./utilities");

let data = [];
data = dataStorage();

const router = express.Router();
router.use(bodyParser());

router.route("").get(function(req, res, next) {
  res.send({
    author: "Onur Kayabasi",
    message: "Hello World!",
  });
});

router
  .route("/person")
  .get(function(req, res, next) {
    res.send(data);
  })
  .post((req, res, next) => utilities.requestBodyExamine(req, res, next, ["firstName", "lastName", "birthDate", "email"]))
  .post(function(req, res, next) {
    let newItem = req.body;
    newItem.id = data.length + 1;
    data.push(newItem);
    res.send(newItem);
  })
  .all(function(req, res, next) {
    res.status(404).send("Sorry can't find that!");
  });

router.route("/person/:id").get(function(req, res, next) {
  let id = req.params["id"] - 1;

  if (data.filter(person => person["id"] === id + 1).length === 1) {
    res.send(data[id]);
  } else {
    res.status(404).send("Sorry, the requested object was not found!");
  }
}).all(function(req, res, next) {
  res.status(404).send("Unavailable request!");
});

const app = express().use("/api", router).listen(3000);
