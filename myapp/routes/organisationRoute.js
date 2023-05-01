let express = require('express');
let bodyParser = require("body-parser");
let orgaModel = require("../models/organisation");
const {log} = require("debug");
const userModel = require("../models/utilisateur");
let router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
    "image/jpg": ".jpg",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif"
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/img/logos/");
    },
    filename: (req, file, callback) => {
        const siren = req.body.siren;
        const nom = req.body.nom;
        //const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        console.log(file);
        callback(null, Date.now() + "_" + siren + "_" + nom + extension);
    }
});
const upload = multer({storage : storage});

router.post('/create', upload.single("logo"), function (req, res) {
    console.log("création d'une organisation...");
    let siren = req.body.siren;
    let nom = req.body.nom;
    let siege = req.body.siege;
    let type = req.body.type;
    let description = req.body.description;
    let logo = req.file.filename;
    orgaModel.isUsedSiren(siren, function (isUsed) {
        console.log("isUsed : " + isUsed);
        let index = logo.indexOf("_");
        let time = logo.substring(0, index);
        const directory = './public/img/logos/'; // Le dossier dans lequel se trouve le fichier à supprimer

        if (isUsed != undefined) {
            console.log("Siren déjà utilisé !");
            //on supprime le logo
            fs.readdir(directory, (err, files) => {
                if (err) throw err;

                files.forEach(file => {
                    if (file.includes(time)) { // Vérifie si le fichier contient la partie du nom recherchée
                        fs.unlink(path.join(directory, file), err => { // Supprime le fichier
                            if (err) throw err;
                            console.log(`Le fichier ${file} a été supprimé`);
                        });
                    }
                });
            });
            res.sendStatus(403);
        }
        else {
            console.log("Siren OK");

            //on supprime l'horodatage du nom du fichier
            const firstUnderscoreIndex = logo.indexOf("_"); // Indice du premier underscore
            if (firstUnderscoreIndex !== -1) {
                logo = logo.slice(firstUnderscoreIndex + 1); // Extrait la partie de la chaîne à partir du premier underscore
                console.log(logo);
            } else {
                console.log(logo); // Aucun underscore trouvé, affiche le nom de fichier d'origine
            }
            fs.readdir(directory, (err, files) => {
                if (err) throw err;
                files.forEach(file => {
                    if (file.includes(time)) {
                        const oldFilePath = directory + file;
                        const logo = directory + file.replace(time + "_", "");
                        fs.rename(oldFilePath, logo, (err) => {
                            if (err) throw err;
                            console.log(`Le fichier ${oldFilePath} a été renommé en ${logo}`);
                        });
                    }
                });
            });

            orgaModel.create(siren, nom, siege, description, logo, type, (created) => {
                let status = (created != undefined) ? 201 : 500;
                res.sendStatus(status);
            });
        }
    })
});

module.exports = router;
//module.exports = multer({storage}).single("image");
