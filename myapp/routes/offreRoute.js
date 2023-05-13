let express = require('express');
let bodyParser = require("body-parser");
let offreModel = require("../models/offre");
const {log} = require("debug");

let router = express.Router();

router.get("/")

