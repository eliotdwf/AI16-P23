let express = require('express');
let bodyParser = require("body-parser");
let orgaModel = require("../models/organisation");
const {log} = require("debug");
const userModel = require("../models/utilisateur");

let router = express.Router();

let alertMessages = [];

router.post('/create', function(req, res) {
    console.log("création d'une organisation...");
    let siren = req.body.get("siren");
    let nom = req.body.get("nom");
    let siege = req.body.get("siege");
    let description = req.body.get("description");
    let logo = req.files.get("logo");

    orgaModel.isUsedSiren(siren, function (isUsed) {
        console.log("isUsed : " + isUsed);
        if (isUsed != undefined) {
            console.log("Siren déjà utilisé !");
            res.sendStatus(403);
        }
        else {
            orgaModel.create(siren, nom, siege, description, logo, type, (created) => {
                let status = (created != undefined) ? 201 : 500;
                res.sendStatus(status);
            });
        }
    })
});