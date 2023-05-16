const express = require('express');
let router = express.Router();
let requireAuth = require('../requireAuth/requireAuth');
let requireCandidat = require('../requireAuth/requireCandidat');
let requireRecruteur = require('../requireAuth/requireRecruteur');
let offreModel = require("../models/offre");
const userModel = require("../models/utilisateur");


/* GET home page. */
router.get('/', requireAuth, function(req, res) {
  let session = req.session;
  switch (session.role) {
    case 1:
      let etatOffre;
      offreModel.getProfilsOffres(etatOffre, function(rows){
        console.log(rows);
        res.render('index', {
          role: session.role,
          offres: rows
        });
      })
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
  res.render('creerOrganisation', { role: req.session.role });
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

router.get("/offres", requireRecruteur, (req, res) => {
  res.render("offres", { role : req.session.role });
})

//TODO : à supprimer, utile pour les tests
router.get("/candidat", (req, res) => {
  let mail = "candidat@mail.fr";
  let mdp = "mdp";
  userModel.isValid(mail, mdp, function(role) {
    if(role === 1 || role === 2 || role === 3) {
      req.session.role = role;
      req.session.loggedin = true;
      req.session.username = mail;
      req.session.userid = mail;
      console.log(req.session);
      res.redirect("/");
    }
    else{
      res.redirect("/connexion");
    }
  });
})

//TODO : à supprimer, utile pour les tests
router.get("/recruteur", (req, res) => {
  let mail = "amazon@mail.fr";
  let mdp = "mdp";
  userModel.isValid(mail, mdp, function(role) {
    if(role === 1 || role === 2 || role === 3) {
      req.session.role = role;
      req.session.loggedin = true;
      req.session.username = mail;
      req.session.userid = mail;
      console.log(req.session);
      res.redirect("/");
    }
    else{
      res.redirect("/connexion");
    }
  });
})

//TODO : à supprimer, utile pour les tests
router.get("/admin", (req, res) => {
  let mail = "admin@mail.fr";
  let mdp = "mdp";
  userModel.isValid(mail, mdp, function(role) {
    if(role === 1 || role === 2 || role === 3) {
      req.session.role = role;
      req.session.loggedin = true;
      req.session.username = mail;
      req.session.userid = mail;
      console.log(req.session);
      res.redirect("/");
    }
    else{
      res.redirect("/connexion");
    }
  });
})
module.exports = router;
