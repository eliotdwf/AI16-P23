let express = require('express');
let bodyParser = require("body-parser");
let offreModel = require("../models/offre");
let userModel = require("../models/utilisateur");
const requireRecruteur = require('../requireAuth/requireRecruteur');
const requireRecruteurOrCandidat = require("../requireAuth/requireRecruteurOrCandidat");

let router = express.Router();

let alertMessages = [];
router.get("/", requireRecruteurOrCandidat, (req, res) => {
    let etatOffre;
    let siren;
    if(req.session.role === 2) {
        userModel.getSirenByEmail(req.session.userid, function(siren){
            if(siren === undefined) {
                res.redirect("../404");
            }
            else {
                offreModel.getProfilsOffres(siren, etatOffre, function (rows) {
                    console.log(rows);
                    res.render('offres', {
                        role: req.session.role,
                        offresEmploi: rows,
                        alertMessages: alertMessages
                    });
                })
            }
        });
    }
    else {
        offreModel.getProfilsOffres(siren, etatOffre, function(rows){
            console.log(rows);
            res.render('offres', {
                role: req.session.role,
                offresEmploi: rows,
                alertMessages: alertMessages
            });
        })
    }

})

router.get("/:id", requireRecruteurOrCandidat, (req, res) => {
    const id = req.params.id;
    if(req.session.role == 1) {
        offreModel.findById(id, function(rows) {
            console.log("offre row: " + rows[0]);
            res.render('detailOffre', {
                role: req.session.role,
                offre: rows[0]
            });
        })
    }
    else {
        offreModel.getSirenById(id, function(sirenOffre) {
            if(sirenOffre === undefined) {
                res.redirect("../404");
            }
            else {
                userModel.getSirenByEmail(req.session.userid, function(sirenUser) {
                    if(sirenUser === undefined) {
                        res.redirect("../404");
                    }
                    else if(sirenUser != sirenOffre) {
                        console.log("sirenOffre: " + sirenOffre)
                        console.log("sirenUser: " + sirenUser)
                        res.redirect("../403");
                    }
                    else {
                        offreModel.findById(id, function(rows) {
                            console.log("offre row: " + rows[0]);
                            res.render('detailOffre', {
                                role: req.session.role,
                                offre: rows[0]
                            });
                        })
                    }
                })
            }
        })
    }
})

router.get("/supprimer/:id", requireRecruteur,  (req, res) => {
    const id = req.params.id;
    offreModel.getSirenById(id, function(sirenOffre) {
        if(sirenOffre === undefined) {
            res.redirect("../404");
        }
        else {
            userModel.getSirenByEmail(req.session.userid, function(sirenUser) {
                if(sirenUser === undefined) {
                    res.redirect("../404");
                }
                else if(sirenUser != sirenOffre) {
                    console.log("sirenOffre: " + sirenOffre)
                    console.log("sirenUser: " + sirenUser)
                    res.redirect("../403");
                }
                else {
                    offreModel.deleteById(id, function(rows) {
                        successMessage = "L'offre n°" + id + " a bien été supprimée";
                        console.log("rows : " + rows + "\nrows[0] : " + rows[0]);
                        alertMessages.push({
                            type: "success",
                            message: successMessage
                        })
                        res.redirect("/");
                    })
                }
            })
        }
    })
})


module.exports = router;