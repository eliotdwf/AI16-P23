const requireAuth = require('./requireAuth');

module.exports = function requireCandidat(req, res, next) {
    requireAuth(req, res, function() {
        if (req.session.role !== 1) {
            // Si l'utilisateur est authentifié mais n'est pas candidat, rediriger vers la page 403
            console.log("redirection requireCandidat => 403 | {session.role: " + req.session.role + " }" );
            res.redirect('/403');
        } else {
            // Si l'utilisateur est authentifié et est candidat, continuer vers la route demandée
            next();
        }
    });
};

