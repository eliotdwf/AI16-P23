let express = require('express');
let bodyParser = require("body-parser");
let offreModel = require("../models/offreModel");
let userModel = require("../models/utilisateurModel");
let typeContratModel = require("../models/typeContratModel");
let typeMetierModel = require("../models/typeMetierModel");
let etatOffreModel = require("../models/etatOffreModel");

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
        console.log(rows);
        res.render('offres', {
            role: role,
            offresEmploi: rows,
            user: req.session.username
        });
    })
})

router.get("/candidatsList/:id", (req, res) => {
    // TODO : aller récupérer les candidats dans la bdd
    res.render("../partials/candidats");
})

router.get("/:id", requireRecruteurOrCandidat, (req, res) => {
    const id = req.params.id;
    if(req.session.role == 1) {
        let pieces;
        offreModel.getPieceOffre(id, function(results) {
            pieces = results;
        })
        offreModel.findById(id, function(rows) {
            console.log("offre row: " + rows[0]);
            res.render('detailOffre', {
                role: req.session.role,
                offre: rows[0],
                pieces: pieces
            });
        })
    }
    else {
        checkSirenOffreUser(id, req.session.siren, function(error, sirenUser, sirenOffre) {
            if (error) {
                res.redirect("../" + error);
            } else {
                offreModel.findById(id, function(rows) {
                    res.render('detailOffre', {
                        role: req.session.role,
                        offre: rows[0]
                    });
                });
            }
        });
    }
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
    let tri = req.body.tri;
    if(tri < 1 || tri > 2){
        tri = 1;
    }
    let etatOffre
    const role = req.session.role;
    if(role === 1) etatOffre = 2;
    if(etatOffre < 1 || etatOffre > 3){
        etatOffre = undefined;  //dans l'appel au model, etatOffre prend la valeur par défaut ("%%")
    }
    let siren = req.session.siren;
    console.log("tri :" + tri)
    offreModel.getProfilsOffres(role, siren, etatOffre, tri, function (rows) {
        let render = (role === 1) ? "../partials/offres-candidat" : "../partials/offres-recruteur";
        res.status(200).render(render, {
            role: role,
            offres: rows
        });
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

router.post("/candidater", (req, res) => {
    const candidat = req.session.userid;
    const offre = req.body.offre;
    console.log(candidat + " " + offre)
    /*candidatureModel.create(req.body.user, req.body.candidature, function(results) {
        console.log("Ajouté")
    });*/

})

module.exports = router;