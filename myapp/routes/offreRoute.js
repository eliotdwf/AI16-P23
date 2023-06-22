let express = require('express');
let bodyParser = require("body-parser");
const multer = require("multer");
let offreModel = require("../models/offreModel");
let userModel = require("../models/utilisateurModel");
let pieceDossierModel = require("../models/pieceDossierModel");
let typeContratModel = require("../models/typeContratModel");
let typeMetierModel = require("../models/typeMetierModel");
let etatOffreModel = require("../models/etatOffreModel");
const fs = require('fs');
const path = require('path');

const requireRecruteur = require('../requireAuth/requireRecruteur');
const requireRecruteurOrCandidat = require("../requireAuth/requireRecruteurOrCandidat");
const {getPieceOffre} = require("../models/offreModel");
const candidatureModel = require("../models/candidatureModel");

let router = express.Router();

router.get("/", requireRecruteurOrCandidat, (req, res) => {
    let tri = 1;
    let etatOffre;
    let siren = req.session.siren;
    const role = req.session.role;
    if(role === 1) {
        etatOffre = 2;
    }
    offreModel.getProfilsOffres(role, siren, etatOffre, tri, function (rows) {
        offreModel.getFiltres(function(filtres) {
            res.render('offres', {
                role: role,
                offresEmploi: rows,
                user: req.session.username,
                filtres: filtres
            });
        })
    })
})

router.get("/candidatsList/:id", (req, res) => {
    candidatureModel.getCandidatsParOffre(req.params.id, function(results) {
        res.render("../partials/candidats", {candidats: results, offre: req.params.id});
    })
})

router.get("/:id", requireRecruteurOrCandidat, (req, res) => {
    const id = req.params.id;
    let pieces;
    offreModel.getPieceOffre(id, function(results) {
        if(!results) res.redirect("../404");
        else {
            if(req.session.role === 1) {
                offreModel.findById(id, function(rows) {
                    if(!rows){
                        //si l'offre n'existe pas, on redirige vers 404
                        res.redirect("../404");
                    }
                    else if(rows[0].id_etat_offre != 2){
                        //si le candidat essaye d'accéder à une offre non publiée, on le redirige vers la page 403
                        res.redirect("../403");
                    }
                    else {
                        candidatureModel.checkAlreadyCandidat(req.session.userid, rows[0].id_offre, function (results)  {
                            res.render('detailOffre', {
                                role: req.session.role,
                                offre: rows[0],
                                piecesOffre: pieces,
                                dejaCandidat: results
                            });
                        })
                    }
                })
            }
            else {  // l'utilisateur est recruteur
                //on vérifie que l'offre appartient à la meme orga que le recruteur
                checkSirenOffreUser(id, req.session.siren, function(error, sirenUser, sirenOffre) {
                    if (error) {
                        res.redirect("../" + error);
                    } else {
                        offreModel.findById(id, function(rows) {
                            if(rows){
                                res.render('detailOffre', {
                                    role: req.session.role,
                                    offre: rows[0],
                                    piecesOffre: pieces
                                });
                            }
                            else {
                                res.redirect("../404") //si l'offre n'existe pas, on redirige le recruteur vers la page 404
                            }
                        });
                    }
                });
            }
        }
    });
})

function checkSirenOffreUser(offreId, sirenUser, callback) {
    offreModel.getSirenById(offreId, function(sirenOffre) {
        if (sirenOffre === undefined) {
                callback('404');
        }
        else {
            if(sirenUser === undefined) callback('404');
            else if(sirenUser != sirenOffre) callback('403');
            else callback(null, sirenUser, sirenOffre);
        }
    });
}

router.post("/supprimer/:id", requireRecruteur,  (req, res) => {
    const id = req.params.id;
    const intitule = req.body.intitule;
    offreModel.deleteById(id, function(result) {
        if(result){
            res.status(200).render("../partials/bs-alert",{
                type: "success",
                message: `L'offre intitulée "${intitule}" a bien été supprimée !`
            });
        }
        else {
            res.status(500).render("../partials/bs-alert", {
                type : "error",
                message: `Une erreur est survenue lors de la suppression de l'offre intitulée "${intitule}". Echec de l'opération`
            });
        }
    })
});

router.post('/offresList', function (req, res) {
    let body = req.body;
    let tri = body.tri;
    if(tri < 1 || tri > 2){
        tri = 1;
    }
    console.log("tri :" + tri);
    let etatOffre;
    const role = req.session.role;
    if(role === 1) etatOffre = 2;
    if(etatOffre < 1 || etatOffre > 3){
        etatOffre = undefined;  //dans l'appel au model, etatOffre prend la valeur par défaut ("%%")
    }
    let siren = req.session.siren;
    offreModel.getProfilsOffresFiltres(role, siren, etatOffre, tri, body, function (rows) {
        let render = (role === 1) ? "../partials/offres-candidat" : "../partials/offres-recruteur";
        res.status(200).render(render, { offres: rows });
    })
});

router.get("/modifier/:id", requireRecruteur, (req, res) => {
    const id = req.params.id;
    checkSirenOffreUser(id, req.session.siren, function(error, sirenUser, sirenOffre) {
        if (error) {
            res.redirect("../" + error);
        }
        else {
            offreModel.findById(id, function(offres) {
                typeContratModel.getAll((typesContrat)=> {
                    typeMetierModel.getAll(typesMetier => {
                        etatOffreModel.getAll(etatsOffre =>{
                            res.render('modificationOffre', {
                                role: req.session.role,
                                offre: offres[0],
                                typesContrat: typesContrat,
                                typesMetier: typesMetier,
                                etatsOffre: etatsOffre
                            });
                        })
                    })
                })
            });
        }
    });
})

router.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const intitule = req.body.intitule;
    const lieu_mission = req.body.lieuMission;
    const rythme = req.body.rythme;
    const salaire = req.body.salaire;
    const description = req.body.description;
    const id_etat_offre = req.body.idEtatOffre;
    const date_validite = req.body.dateValidite;
    const pieces_requises_candidature = req.body.piecesCandidatures;
    const id_type_metier = req.body.idTypeMetier;
    const id_type_contrat = req.body.idTypeContrat
    offreModel.updateById(id, intitule, lieu_mission, rythme, salaire, description, id_etat_offre, date_validite,
        pieces_requises_candidature, id_type_metier, id_type_contrat,  function(result) {
        if(result){
            res.status(200).render("../partials/bs-alert",{
                type: "success",
                message: `Les modifications de l'offre "${intitule}" ont bien été enregistrées !`
            });
        }
        else {
            res.status(500).render("../partials/bs-alert", {
                type : "error",
                message: `Une erreur est survenue lors de la suppression de l'offre intitulée "${intitule}". Echec de l'opération`
            });
        }
    })
});



const MIME_TYPES = {
    "image/jpg": ".jpg",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "application/pdf": ".pdf"
}

const storagePiece = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/files/");
    },
    filename: (req, file, callback) => {
        callback(null, req.session.username + "_" + Date.now() + "_" + req.body.description + "." + file.originalname.split('.').pop());
    }
});
const upload = multer({storage : storagePiece});
const uploadPiece = upload.single("piece");
router.post("/pieceDossier/", uploadPiece, (req, res) => {
    try{
        pieceDossierModel.create(req.body.id, req.file.filename, req.body.description, (created) => {
            created ? res.sendStatus(200) : res.sendStatus(500);
        })
    } catch (e) {
        res.sendStatus(500);
    }

})

router.post("/create", requireRecruteur, (req, res) => {
    let intitule = req.body.intitule;
    let description = req.body.description;
    let lieuMission = req.body.lieuMission;
    let rythme = req.body.rythme;
    let salaire = req.body.salaire;
    let idEtatOffre = req.body.idEtatOffre;
    let dateValidite = req.body.dateValidite;
    let piecesCandidatures = req.body.piecesCandidatures;
    let idTypeMetier = req.body.idTypeMetier;
    let idTypeContrat = req.body.idTypeContrat;
    let siren = req.session.siren;
    offreModel.create(intitule, lieuMission, rythme, salaire, description, dateValidite, piecesCandidatures,
        siren, idTypeMetier, idTypeContrat, idEtatOffre, result => {
        if(result) {
            res.status(200).render("../partials/bs-alert", {
                type: "success",
                message: `L'offre intitulée "${intitule}" a été créée avec succès !`
            });
        }
        else {
            res.status(500).render("../partials/bs-alert", {
                type: "error",
                message: `Une erreur est survenue lors de la creation de l'offre intitulée "${intitule}" !`
            });
        }
    })
})

module.exports = router;