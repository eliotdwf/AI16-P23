const requireAuth = require('./requireAuth');

module.exports = function requireRecruteurOrCandidat(req, res, next) {
    requireAuth(req, res, function() {
        if (req.session.role !== 2 && req.session.role !== 1) {
            // Si l'utilisateur est authentifié mais n'est pas recruteur, rediriger vers la page 403
            console.log("redirection requireRecruteurOrCandidat => 403 | {session.role: " + req.session.role + " }" );
            res.redirect('/403');
        } else {
            // Si l'utilisateur est authentifié et est recruteur ou candidat, continuer vers la route demandée
            next();
        }
    });
};

