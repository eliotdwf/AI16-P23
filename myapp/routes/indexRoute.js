const express = require('express');
let router = express.Router();

let requireAuth = require('../requireAuth/requireAuth');
let requireCandidat = require('../requireAuth/requireCandidat');
const requireRecruteur = require('../requireAuth/requireRecruteur');

const userModel = require("../models/utilisateurModel");
let orgaModel = require("../models/organisationModel");
let demandeCreaOrgaModel = require("../models/demandeCreaOrgaModel");
let demandeDevenirRecruteurModel = require("../models/demandeDevenirRecruteurModel");
const offreModel = require("../models/offreModel");
const typeContratModel = require("../models/typeContratModel");
const typeMetierModel = require("../models/typeMetierModel");
const etatOffreModel = require("../models/etatOffreModel");

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

router.get("/gerer-recruteurs", requireRecruteur, (req, res) => {
    demandeDevenirRecruteurModel.getUsersBySiren(req.session.siren, (rows) => {
        res.render("nouveauxRecruteurs", {
            role: req.session.role,
            futursRecruteurs: rows
        })
    })
})

router.get("/creer-offre", requireRecruteur, (req, res) => {
    typeContratModel.getAll((typesContrat)=> {
        typeMetierModel.getAll(typesMetier => {
            res.render('creerOffre', {
                role: req.session.role,
                typesContrat: typesContrat,
                typesMetier: typesMetier
            });
        })
    });
})

router.get("/test", (req, res) => {
    res.render("test", {role: 4});
})

router.get("/test-form-creer-compte", (req, res) => {
    res.render("test-creer-compte.ejs");
})

router.get("/test-form-connexion", (req, res) => {
    res.render("test-connexion.ejs");
})

router.post("/test-creer-compte", (req, res) => {
    console.log("mot de passe du body : " + req.body.password);
    res.sendStatus(201);
})

router.post("/authent", (req, res) => {
    res.status(401).json({ "message" : "Le mot de passe ou l'email est incorrect !"});
})

router.get("/test-mon-compte", (req, res) => {
    res.render("test-mon-compte", {role: 4});
})

router.get("/form-maj-compte", (req, res) => {
    res.status(200).render("test-maj-compte");
})

router.get("/infos-compte", (req, res) => {
    res.status(200).render("test-infos-compte");
})

router.put("/maj-infos-compte", (req, res) => {
    console.log("nom : " + req.body.nom);
    console.log("prenom : " + req.body.prenom);
    console.log("mdp : " + req.body.password);

    res.sendStatus(204); // succès, rien à retourner

})

module.exports = router;
