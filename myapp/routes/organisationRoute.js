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
        const siren = req.params.siren;
        const extension = MIME_TYPES[file.mimetype];
        console.log("file : " + file);
        callback(null, siren + extension);
    }
});
const upload = multer({storage : storage});
const uploadLogo = upload.single("logo");

router.post('/create/:siren', function (req, res) {
    console.log("création d'une organisation...");
    let siren = req.params.siren;
    console.log("siren : " + siren)

    //on vérifie que le siren saisi par l'utilisateur n'est pas deja utilise par une autre organisation
    orgaModel.isUsedSiren(siren, function (isUsed) {
        console.log(isUsed);
        if (isUsed) {
            console.log("Siren déjà utilisé !");
            res.sendStatus(400);
        }
        else {
            uploadLogo(req, res, (err) => {
                if(err) {
                    console.error("une erreur est survenue ! \n" + err)
                    res.sendStatus(500);
                }
                else {
                    console.log("Siren OK");
                    let nom = req.body.nom;
                    let siege = req.body.siege;
                    let type = req.body.type;
                    let description = req.body.description;
                    let logo = req.file.filename;
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
                    });
                }
            })

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
