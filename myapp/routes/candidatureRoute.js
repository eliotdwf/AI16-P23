let express = require('express');
let bodyParser = require("body-parser");
let offreModel = require("../models/offreModel");
let candidatureModel = require("../models/candidatureModel");
let userModel = require("../models/utilisateurModel");
const db = require("../models/db");
let pieceDossierModel = require("../models/pieceDossierModel");
const https = require('https');
const fs = require('fs');
const path = require('path');

let router = express.Router();

router.get("/", (req, res) => {
    candidatureModel.getCandidatures(req.session.userid, function(rows) {
        res.status(200).render("candidatures", {
            role: req.session.role,
            candidatures: rows
        });
    })
})
router.delete("/supprimer/:id", (req, res) => {
    candidatureModel.find(req.params.id, req.session.userid, function(candidature) {
        pieceDossierModel.delete(candidature, function(pieceDeleteResults) {
            candidatureModel.delete(candidature, function(results) {
                results ? res.sendStatus(200) : res.sendStatus(500);
            })
        })
    });
})

router.get("/get-pieces/:idCandidat/:idOffre", (req, res) => {
    candidatureModel.find(req.params.idOffre, req.params.idCandidat, function(candidatureId) {
        pieceDossierModel.getAllPiece(candidatureId, function(pieces) {
            res.send({pieces: pieces});
        })
    })
});

router.get("/download/:idPiece", (req, res) => {
    pieceDossierModel.getPieceOffre(req.params.idPiece, function(results) {
        if(results) {
            console.log(__dirname + "/public/files/"+results)
            res.download(__dirname + "/../public/files/"+results)
        }
    })
})
router.post("/candidater/:idOffre", (req, res) => {
    const candidat = req.session.userid;
    const offre = req.params.idOffre;
    candidatureModel.create(candidat, offre, (results) => {
        if(results !== null) res.send({value: results, status: 200});
        else res.send({value: null, status: 500});
    })
})

module.exports = router;