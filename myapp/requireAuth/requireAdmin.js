const requireAuth = require('./requireAuth');

module.exports = function requireAdmin(req, res, next) {
    requireAuth(req, res, function() {
        if (req.session.role !== 3) {
            // Si l'utilisateur est authentifié mais n'est pas admin, rediriger vers la page 403
            console.log("redirection requireAdmin => 403| {session.role: " + req.session.role + " }" );
            res.redirect('/403');
        } else {
            // Si l'utilisateur est authentifié et est admin, continuer vers la route demandée
            next();
        }
    });
};

