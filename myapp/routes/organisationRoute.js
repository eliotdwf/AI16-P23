let express = require('express');
let bodyParser = require("body-parser");
let orgaModel = require("../models/organisationModel");
let demandeCreaOrgaModel = require("../models/demandeCreaOrgaModel");
const userModel = require("../models/utilisateurModel");

const requireAdmin = require('../requireAuth/requireAdmin');
const {log} = require("debug");
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
    //on vérifie que le siren saisi par l'utilisateur n'est pas deja utilise par une autre organisation
    orgaModel.isUsedSiren(siren, function (isUsed) {
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
            res.sendStatus(400);
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
                console.log("created : " + created)
                let status = (created != undefined) ? 201 : 500;
                if(status === 201) {
                    //TODO : vérifier que le candidat n'a pas déjà saisi une demande de création d'organisation
                    //si l'organisation est bien cree, on l'ajoute aux demandes de creation a valider par un administrateur
                    demandeCreaOrgaModel.insert(req.session.userid, siren, (done) => {
                        console.log("done : " + done)
                        status = (done != undefined) ? 201 : 500;
                        res.sendStatus(status);
                    })
                }
                else {
                    res.sendStatus(status);
                }
                /*if(created != undefined) {
                    console.log(__dirname);
                    //logo.sendFile(__dirname, '../img/logo/', `${siren}-logo`);
                }*/
            });
        }
    })
});

router.get("/description/:siren", (req, res) => {
    orgaModel.getDescriptionBySiren(req.params.siren, function(rows){
        res.render("../partials/description-orga", {
            type_organisation: rows[0].nom,
            description: rows[0].description
        })
    })
})

router.get("/", requireAdmin, (req, res) => {
    let typeOrga;
    orgaModel.getOrgasNonCrees(typeOrga, function(rows) {
        res.render("organisations", {
            role: req.session.role,
            orgas: rows
        })
    })
})

router.post("/orgasList", requireAdmin, (req, res) => {
    let typeOrga = req.body.typeOrga;
    if(typeOrga < 1 || typeOrga > 2) typeOrga = undefined;
    console.log("typeOrga : " + typeOrga);
    orgaModel.getOrgasNonCrees(typeOrga, function(rows) {
        res.status(200).render("../partials/organisationsList", {
            role: req.session.role,
            organisations: rows
        })
    })
})

router.post("/valider-creation", requireAdmin, (req, res) => {
    let siren = req.body.siren;
    let email = req.body.emailCreateur;
    // TODO : supprimer les demandes du créateur (candidatures, rejoindre une orga, créer une orga)
    orgaModel.confirmerCreation(siren, function(resultCreationOrga) {
        if(resultCreationOrga) {
            userModel.devenirRecruteur(email, siren, function(result) {
                if(result) {
                    res.status(200).render("../partials/bs-alert",{
                        type: "success",
                        message: `L'organisation ${siren} a bien été créée !`
                    });
                }
                else {
                    res.status(500).render("../partials/bs-alert",{
                        type: "error",
                        message: `Une erreur est survenue lors de la création de l'organisation ${siren}.`
                    });
                }
            })
        }
        else {
            res.status(500).render("../partials/bs-alert",{
                type: "error",
                message: `Une erreur est survenue lors de la création de l'organisation ${siren}.`
            });
        }
    })
})

router.post('/refuser-creation', requireAdmin, (req, res) => {
    let siren = req.body.siren;
    let email = req.body.emailCreateur;
    //TODO : notifier l'utilisateur que la demande est rejetee
    demandeCreaOrgaModel.refuserCreation(siren, email, (resultDelete) => {
        console.log("refuserCreation fini");
        if(resultDelete) {
            //TODO : supprimer le logo
            orgaModel.delete(siren, (result) => {
                if(result) {
                    res.status(200).render("../partials/bs-alert",{
                    type: "success",
                        message: `L'organisation ${siren} a bien été supprimée !`
                    });
                }
                else {
                     res.status(500).render("../partials/bs-alert",{
                         type: "error",
                         message: `Une erreur est survenue lors de la suppression de l'organisation ${siren}.`
                     });
                 }
            })
        }
        else {
            res.status(500).render("../partials/bs-alert",{
                type: "error",
                message: `Une erreur est survenue lors de la suppression de l'organisation ${siren}.`
            });
        }
    })
})

module.exports = router;
//module.exports = multer({storage}).single("image");
