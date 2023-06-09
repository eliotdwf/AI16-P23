let express = require('express');
let bodyParser = require("body-parser");
let orgaModel = require("../models/organisationModel");
let demandeCreaOrgaModel = require("../models/demandeCreaOrgaModel");
let demandeDevenirRecruteurModel = require("../models/demandeDevenirRecruteurModel");
const userModel = require("../models/utilisateurModel");

const requireAdmin = require('../requireAuth/requireAdmin');
const requireCandidat = require('../requireAuth/requireCandidat');
const requireCandidatOrRecruteur = require("../requireAuth/requireRecruteurOrCandidat");

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
        callback(null, siren + extension);
    }
});
const upload = multer({storage : storage});
const uploadLogo = upload.single("logo");

router.post('/create/:siren', requireCandidat, function (req, res) {
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
                    console.log("Siren OK, logo enregistré");
                    let nom = req.body.nom;
                    let siege = req.body.siege;
                    let type = req.body.type;
                    let description = req.body.description;
                    let logo = req.file.filename;
                    orgaModel.create(siren, nom, siege, description, logo, type, (created) => {
                        let status = (created != undefined) ? 201 : 500;
                        if(status === 201) {
                            //si l'organisation est bien cree, on l'ajoute aux demandes de creation a valider par un administrateur
                            demandeCreaOrgaModel.insert(req.session.userid, siren, (done) => {
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
    demandeCreaOrgaModel.deleteDemande(siren, email, (resultDelete) => {
        if(resultDelete) {
            orgaModel.getCheminLogo(siren, cheminLogo => {
                if(cheminLogo) {
                    //suppression du logo
                    supprimerLogo(cheminLogo, result => {
                        if(result === 200){
                            //suppression de l'orga
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
                    });
                }
                else {
                    console.error("Echec de la récupération du chemin du logo [cheminLogo=" + cheminLogo + "]");
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

router.post("/annuler-demande-creation-orga", requireCandidat,(req, res) => {
    let siren = req.body.siren;
    let email = req.session.userid;
    demandeCreaOrgaModel.deleteDemande(siren, email, resultDeleteDemande => {
        if(resultDeleteDemande) {
            orgaModel.getCheminLogo(siren, cheminLogo => {
                if (cheminLogo) {
                    //suppression du logo
                    supprimerLogo(cheminLogo, result => {
                        if (result === 200) {
                            orgaModel.delete(siren, resultDeleteOrga => {
                                //todo : delete le logo
                                if (resultDeleteOrga) {
                                    res.status(200).render("../partials/bs-alert", {
                                        type: "success",
                                        message: `La demande de création de l'organisation ${siren} a bien été supprimée !`
                                    })
                                } else {
                                    res.status(500).render("../partials/bs-alert", {
                                        type: "error",
                                        message: `Une erreur est survenue lors de la suppression de la demande de création de l'organisation ${siren} !`
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        else {
            res.status(500).render("../partials/bs-alert", {
                type: "error",
                message: `Une erreur est survenue lors de la suppression de la demande de création de l'organisation ${siren} !`
            })
        }
    })
})

function supprimerLogo(nomLogo, callback){
    // Chemin complet du fichier
    const filePath = path.join(__dirname, '..', 'public', 'img', 'logos', nomLogo);
    console.log("filepath : " + filePath);
    // Vérifier si le fichier existe
    if (fs.existsSync(filePath)) {
        // Supprimer le fichier
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                callback(500);
            } else {
                console.log(`Fichier ${nomLogo} supprimé.`);
                callback(200);
            }
        });
    } else {
        console.log(`Le fichier ${nomLogo} n'existe pas.`);
        callback(404);
    }
}

/*
   WEB Service REST Method POST
 */
router.post("/api-orgas-crees", requireCandidat, (req, res) => {
    let typeOrga = req.body.typeOrga;
    if(typeOrga < 1 || typeOrga > 2) typeOrga = undefined;
    orgaModel.getOrgasCrees(typeOrga, rows => {
        console.log(rows);
        res.status(200).json(rows);
    })
})

router.post("/demander-rejoindre/:siren", requireCandidat, (req, res) => {
    let siren = req.params.siren;
    let email = req.session.userid;
    demandeDevenirRecruteurModel.insert(email, siren, (result) => {
        if(result) res.sendStatus(200);
        else res.sendStatus(500);
    })
})

router.delete("/supprimer-demande-rejoindre-orga", requireCandidatOrRecruteur, (req, res) => {
    let siren = req.body.siren;
    let email = req.body.email;
    if(!email) email = req.session.userid;
    demandeDevenirRecruteurModel.delete(email, siren, (result) => {
        if(result) {
            res.status(200).render("../partials/bs-alert", {
                type: "success",
                message: `La demande pour rejoindre l'organisation ${siren} a bien été supprimée !`
            })
        }
        else {
            res.status(500).render("../partials/bs-alert", {
                type: "error",
                message: `Une erreur est survenue lors de la suppression de la demande pour rejoindre l'organisation ${siren} !`
            })
        }
    })
})

module.exports = router;
//module.exports = multer({storage}).single("image");
