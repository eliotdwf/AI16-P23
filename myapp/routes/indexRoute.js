var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express coucou' });
});

router.get("/connexion", function(req, res, next) {
  res.render('connexion', { title: 'Connexion' });


})

module.exports = router;
