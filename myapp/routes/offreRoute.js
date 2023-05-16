let express = require('express');
let bodyParser = require("body-parser");
let offreModel = require("../models/offre");
const requireRecruteurOrCandidat = require("../requireAuth/requireRecruteurOrCandidat");

let router = express.Router();

router.get("/", requireRecruteurOrCandidat, (req, res) => {
    let etatOffre;
    offreModel.getProfilsOffres(etatOffre, function(rows){
        console.log(rows);
        res.render('offres', {
            role: req.session.role,
            offresEmploi: rows
        });
    })
})

router.get("/:id", requireRecruteurOrCandidat, (req, res) => {
    const id = req.params.id;
    offreModel.findById(id, function(rows){
        console.log("offre row: " + rows[0]);
        res.render('detail-offre', {
            role: req.session.role,
            offre: rows[0]
        });
    })
})


module.exports = router;