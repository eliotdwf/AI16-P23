module.exports =  function requireAdmin(req, res, next) {
    if (!req.session) {
        // Si l'utilisateur n'est pas authentifié ou n'est pas admin, rediriger vers la page de connexion
        if (req.xhr) {
            //requete ajax
            res.sendStatus(401);
        } else {
            // redirection
            res.redirect('/connexion');
        }
    }
    else if(req.session != 3){
        if (req.xhr) {
            //requete ajax
            res.status(403).render("../partials/403-content");
        } else {
            // redirection
            res.render('403');
        }
    }
    else {
        // Si l'utilisateur est authentifié, continuer vers la route demandée
        next();
    }
};
