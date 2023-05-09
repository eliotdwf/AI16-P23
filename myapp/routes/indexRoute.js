const express = require('express');
let router = express.Router();
let requireAuth = require('../requireAuth/requireAuth');
let requireCandidat = require('../requireAuth/requireCandidat');


/* GET home page. */
router.get('/', requireAuth, function(req, res, next) {
  let session = req.session;
  switch (session.role) {
    case 1:
      res.render('index', { role: session.role });
      break;
    case 2:
      //TODO : redirect vers page accueil recruteur
      res.redirect("/creer-organisation");
      break;
    case 3:
      res.redirect("/users");
      break;
  }
});

router.get("/connexion", function(req, res, next) {
  req.session.destroy();
  console.log(req.session);
  res.render('connexion', { title: 'Connexion' });
});

router.get("/creer-compte", (req, res) => {
  if(req.session.userid){
    res.redirect("/");
  }
  else {
    res.render('creerCompte', { title: 'Créer un compte'});
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

module.exports = router;
