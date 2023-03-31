let express = require('express');
let bodyParser = require("body-parser");
let userModel = require("../models/utilisateur");

let router = express.Router();

let alertMessages = [];

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

router.get('/', function (req, res, next) {
  userModel.getAll(function(rows) {
    res.render('users', {
      title: 'Liste des utilisateurs',
      users: rows,
      alertMessages: alertMessages
    });
  });
});

router.get('/deactivate-account/:email', function (req, res) {
  let email = req.params.email;
  userModel.deactivate(email, function(result) {
    if(result){
      res.render("../partials/bs-alert",{
        type: "success",
        message: `Le compte de l'utilisateur ${email} a bien été désactivé.`
      });
    }
    else {
      res.render("../partials/bs-alert", {
        type : "error",
        message: `Une erreur est survenue lors de la désactivation du compte de l'utilisateur ${email}. Echec de l'opération`
      });
    }
  });
});


router.get('/activate-account/:email', function (req, res) {
  let email = req.params.email;
  userModel.activate(email, function(result) {
    if(result){
      res.render("../partials/bs-alert",{
        type: "success",
        message: `Le compte de l'utilisateur ${email} a bien été activé.`
      });
    }
    else {
      res.render("../partials/bs-alert", {
        type : "error",
        message: `Une erreur est survenue lors de l'activation du compte de l'utilisateur ${email}. Echec de l'opération`
      });
    }
  });
});

router.get('/userslist', function (req, res, next) {
  userModel.getAll(function(rows) {
    res.render('../partials/usersList', { users: rows });
  });
});

module.exports = router;
