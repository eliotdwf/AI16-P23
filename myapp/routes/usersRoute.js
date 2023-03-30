var express = require('express');
var userModel = require("../models/utilisateur");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/userslist', function (req, res, next) {
  userModel.getAll(function(rows) {
    res.render('users', {
      title: 'Liste des utilisateurs',
      users: rows
    });
  });
});

module.exports = router;
