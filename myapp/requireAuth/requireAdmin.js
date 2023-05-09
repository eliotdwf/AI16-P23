module.exports =  function requireAdmin(req, res, next) {
    if (!req.session) {
        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        console.log("redirection requireAdmin => connexion");
        res.redirect('/connexion');
    }
    else if(req.session != 3){
        // si l'utilisateur est authentifié mais n'est pas admin, on redirige vers la page 403
        console.log("redirection requireAdmin => 403");
        res.redirect('/403');
    }
    else {
        // Si l'utilisateur est authentifié, continuer vers la route demandée
        next();
    }
};
