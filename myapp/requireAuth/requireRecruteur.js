const requireAuth = require('./requireAuth');

module.exports = function requireRecruteur(req, res, next) {
    requireAuth(req, res, function() {
        if (req.session.role !== 2) {
            // Si l'utilisateur est authentifié mais n'est pas recruteur, rediriger vers la page 403
            console.log("redirection requireRecruteur => 403 | {session.role: " + req.session.role + " }" );
            res.redirect('/403');
        } else {
            // Si l'utilisateur est authentifié et est recruteur, continuer vers la route demandée
            next();
        }
    });
};

