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

const app = express().use("/api", router).listen(3000);
