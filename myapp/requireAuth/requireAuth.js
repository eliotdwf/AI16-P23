module.exports = function requireAuth(req, res, next) {
    if (!req.session.userid) {
        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        console.log("redirection requireAuth => connexion");
        res.redirect('/connexion');
    } else {
        // Si l'utilisateur est authentifié, continuer
        next();
    }
};
