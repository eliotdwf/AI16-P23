let express = require('express');
let bodyParser = require("body-parser");
let userModel = require("../models/utilisateur");
const {log} = require("debug");

let router = express.Router();

let alertMessages = [];

actif = "%%"
role = "%%";


/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

router.get('/', function (req, res, next) {
  userModel.getAll(actif, role, function(rows) {
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

router.post('/userslist', function (req, res, next) {
  role = req.body.role;
  userModel.getAll(actif, role, function(rows) {
    res.render('../partials/usersList', { users: rows });
  });
});

router.post('/authentication', function (req, res, next) {
  console.log("authentication ...")
  mail = req.body.email;
  mdp = req.body.pwd;
  userModel.isValid(mail, mdp, function(isValid) {
    if(isValid != undefined) {
      res.sendStatus(200);
    }
    else{
      res.sendStatus(401);
    }
  });
})

module.exports = router;
