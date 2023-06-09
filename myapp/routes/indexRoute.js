const express = require('express');
let router = express.Router();
let requireAuth = require('../requireAuth/requireAuth');
let requireCandidat = require('../requireAuth/requireCandidat');
const userModel = require("../models/utilisateurModel");
let orgaModel = require("../models/organisationModel");
let demandeCreaOrgaModel = require("../models/demandeCreaOrgaModel");
let demandeDevenirRecruteurModel = require("../models/demandeDevenirRecruteurModel");

/* GET home page. */
router.get('/', requireAuth, function(req, res) {
  let session = req.session;
  switch (session.role) {
    case 1:
      res.redirect("/offres");
      break;
    case 2:
      //TODO : redirect vers page accueil recruteur
      res.redirect("/offres");
      break;
    case 3:
      res.redirect("/users");
      break;
  }
});

router.get("/connexion", function(req, res, next) {
  req.session.destroy();
  console.log(req.session);
  res.render('connexion', { title: 'Connexion', role: ''});
});

router.get("/creer-compte", (req, res) => {
  if(req.session.userid){
    res.redirect("/");
  }
  else {
    res.render('creerCompte', { title: 'Créer un compte', role: req.session.role});
  }
});

router.get("/creer-organisation", requireCandidat, (req, res) => {
  //on vérifie que l'utilisateur n'a pas déjà déposé une demande de creation d'orga
  demandeCreaOrgaModel.getDemandesByEmail(req.session.userid, (row) => {
      if(row) {
          // l'utilisateur a deja saisi une demande
          res.render("detailDemandeCreaOrga", {
              role: req.session.role,
              orga: row
          })
      }
      else {
          res.render('creerOrganisation', { role: req.session.role });
      }
  })

});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/connexion');
});

router.get("/403", requireAuth, (req, res) => {
  res.render("403", { role: req.session.role });
})

router.get("/404", requireAuth, (req, res) => {
  res.render("404", { role: req.session.role });
})


router.get("/mon-compte", requireAuth, (req, res) => {
  userModel.findById(req.session.userid, function(user) {
    res.render("monCompte", {
      role: req.session.role,
      user: user
    });
  })
})

router.get("/rejoindre-organisation", requireCandidat, (req, res) => {
    demandeDevenirRecruteurModel.getByEmail(req.session.userid, (row) => {
        if(row) {
            // l'utilisateur a deja saisi une demande
            res.render("rejoindreOrgaDetail", {
                role: req.session.role,
                orga: row
            })
        }
        else {
            let typeOrga;
            orgaModel.getOrgasCrees(typeOrga, (results) => {
                res.render("rejoindreOrga", {
                    role: req.session.role,
                    orgas: results
                })
            })
        }
    })
})

module.exports = router;
