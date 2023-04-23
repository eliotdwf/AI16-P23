let express = require('express');
let bodyParser = require("body-parser");
let orgaModel = require("../models/organisation");
const {log} = require("debug");
const userModel = require("../models/utilisateur");
let router = express.Router();
const multer = require("multer");
const MIME_TYPES = {
    "image/jpg": ".jpg",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif"
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./myapp/public/img/logos/");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.MIMEType];
        console.log(file.MIMEType);
        callback(null, Date.now() + "_" + name)
    }
});
const upload = multer({storage : storage});

let alertMessages = [];

router.post('/create', upload.single("logo"), function (req, res) {
    console.log("création d'une organisation...");
    let siren = req.body.siren;
    let nom = req.body.nom;
    let siege = req.body.siege;
    let type = req.body.type;
    let description = req.body.description;
    let logo = req.file.filename
    orgaModel.isUsedSiren(siren, function (isUsed) {
        console.log("isUsed : " + isUsed);
        if (isUsed != undefined) {
            console.log("Siren déjà utilisé !");
            res.sendStatus(403);
        }
        else {
            console.log("Siren OK");
            orgaModel.create(siren, nom, siege, description, logo, type, (created) => {
                let status = (created != undefined) ? 201 : 500;
                res.sendStatus(status);
            });
        }
    })
});

module.exports = router;
//module.exports = multer({storage}).single("image");
