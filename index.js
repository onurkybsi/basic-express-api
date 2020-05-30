const express = require("express");
const bodyParser = require("body-parser");
const dataStorage = require("./dataStorage");

let data = dataStorage();

const router = express.Router();

router.route("").get(function (req, res, next) {
  res.send({
    author: "Onur Kayabasi",
    message: "Hello World!",
  });
});

router.route("/person").get(function (req, res, next) {
  res.send(data);
});

router.route("/person/:id").get(function (req, res, next) {
  res.send(data[req.params["id"]]);
});

const app = express().use("/api", router).listen(3000);
