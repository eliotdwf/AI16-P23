var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express coucou' });
});

router.get("/connexion", function(req, res, next) {
  res.render('connexion', { title: 'Connexion' });
});

router.get("/creer-compte", (req, res) => {
  res.render('creerCompte', { title: 'Créer un compte'})
});

router.get("/creer-organisation", (req, res) => {
  res.render('creerOrganisation');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
