let express = require('express');
let bodyParser = require("body-parser");
let userModel = require("../models/utilisateur");
const {log} = require("debug");
const requireAdminRights = require('../requireAuth/requireAdmin');

let router = express.Router();

let alertMessages = [];

router.get('/', requireAdminRights, function (req, res, next) {
  let actif = undefined;
  let role = undefined;
  userModel.getAll( actif, role, function(rows) {
    res.render('users', {
      title: 'Liste des utilisateurs',
      users: rows,
      alertMessages: alertMessages,
      role: req.session.role
    });
  });
});

router.get('/deactivate-account/:email', function (req, res) {
  let email = req.params.email;
  userModel.deactivate(email, function(result) {
    if(result){
      res.status(200).render("../partials/bs-alert",{
        type: "success",
        message: `Le compte de l'utilisateur ${email} a bien été désactivé.`
      });
    }
    else {
      res.status(500).render("../partials/bs-alert", {
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
      res.status(200).render("../partials/bs-alert",{
        type: "success",
        message: `Le compte de l'utilisateur ${email} a bien été activé.`
      });
    }
    else {
      res.status(500).render("../partials/bs-alert", {
        type : "error",
        message: `Une erreur est survenue lors de l'activation du compte de l'utilisateur ${email}. Echec de l'opération`
      });
    }
  });
});

router.post('/userslist', function (req, res) {
  let actif = undefined;
  let role = req.body.role;
  if(role < 1 || role > 3){
    role = undefined;  //dans l'appel au model, role prend la valeur par défaut ("%%")
  }
  userModel.getAll(actif, role, function(rows) {
    res.status(200).render('../partials/usersList', { users: rows });
  });
});

router.post('/authentication', function (req, res, next) {
  console.log("authentication ...")
  let mail = req.body.email;
  let mdp = req.body.pwd;
  userModel.isValid(mail, mdp, function(role) {
    if(role === 1 || role === 2 || role === 3) {
      req.session.role = role;
      req.session.loggedin = true;
      req.session.username = mail;
      req.session.userid = mail;
      console.log("Successful login")
      console.log(req.session);
      res.sendStatus(200);
    }
    else{
      console.log("Login failed")
      res.sendStatus(401);
    }
  });
})

router.post('/create', function(req, res) {
  console.log("création du compte ...");
  let email = req.body.email;
  let pwd = req.body.pwd;
  let lastname = req.body.lastname;
  let firstname = req.body.firstname;
  let phone = req.body.phone;
  userModel.isUsedEmail(email, function (isUsed) {
    console.log("isUsed : " + isUsed);
    if (isUsed != undefined) {
      console.log("Email déjà utilisé !");
      res.sendStatus(403);
    }
    else {
      userModel.create(email, pwd, lastname, firstname, phone, (created) => {
        let status = (created != undefined) ? 201 : 500;
        res.sendStatus(status);
      });
    }
  })
});

module.exports = router;
