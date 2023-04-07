const db = require('./db.js');

module.exports = {
    find: function (email, callback) {
        db.query("select * from Utilisateur where email= ?",email, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getAll: function (actif, role, callback) {
        db.query(`select * from Utilisateur WHERE actif LIKE '${actif}' AND role LIKE '${role}'`, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    isValid: function (email, mdp, callback) {
        sql = "SELECT 1 FROM Utilisateur WHERE email = ? AND mdp = ?";
        db.query(sql, [email, mdp], function (err, result) {
            if (err) throw err;
            callback(result[0]);
        });
    },
    /*create: function (email, nom, prenom, pwd, type, callback) {
        //todo
        return false;
    },*/
    deactivate : function (email, callback) {
        sql = "UPDATE Utilisateur SET actif = 0 WHERE email = ?";
        db.query(sql, email, function(err, results) {
            if (err) throw err;
            callback(true);
        });
    },
    activate : function (email, callback) {
        sql = "UPDATE Utilisateur SET actif = 1 WHERE email = ?";
        db.query(sql, email, function(err, results) {
            if (err) throw err;
            callback(true);
        });
    },
    setAsAdmin : function(email, callback) {
        sql = "SELECT Role FROM Utilisateur WHERE email = ?";
        db.query(sql, email, function(err, results) {
            if(err) throw err;
            if(results === 3) {
                callback(2);
            }

        });
        //TODO: Supprimer toutes les demandes de candidatures,
        // de rajout à une orga,
        // et passer le role à 3
        // et Recruteur
    }
}