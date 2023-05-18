const db = require('./db.js');

module.exports = {
    find: function (email, callback) {
        db.query("select * from Utilisateur where email= ?",email, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getSirenByEmail: function(email, callback) {
        db.query("select siren from Utilisateur where email= ?",email, function
            (err, results) {
            if (err) throw err;
            if(results[0]){
                callback(results[0].siren);
            }
            else {
                callback(undefined);
            }
        });
    },
    getAll: function (actif= "%%", role = "%%", callback) {
        db.query(`select * from Utilisateur WHERE actif LIKE '${actif}' AND id_role LIKE '${role}'`, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    isValid: function (email, mdp, callback) {
        let sql = "SELECT id_role FROM Utilisateur WHERE email = ? AND mdp = ?";
        db.query(sql, [email, mdp], function (err, result) {
            if (err) throw err;
            if(result[0]){
                callback(result[0].id_role);
            }
            else {
                callback(undefined);
            }
        });
    },
    isUsedEmail: function (email, callback) {
        let sql = "SELECT 1 FROM Utilisateur WHERE email = ?";
        db.query(sql, email, function (err, result) {
            if (err) throw err;
            callback(result[0]);
        });
    },
    create: function (email, pwd, nom, prenom, tel, callback) {
        let sql = "INSERT INTO Utilisateur VALUES(?, ?, ?, ?, ?, curdate(), 1, 1, null)";
        db.query(sql, [email, pwd, nom, prenom, tel], function (err) {
            if(err) throw err;
            callback(true);
        })

    },
    deactivate : function (email, callback) {
        let sql = "UPDATE Utilisateur SET actif = 0 WHERE email = ?";
        db.query(sql, email, function(err) {
            if (err) throw err;
            callback(true);
        });
    },
    activate : function (email, callback) {
        let sql = "UPDATE Utilisateur SET actif = 1 WHERE email = ?";
        db.query(sql, email, function(err) {
            if (err) throw err;
            callback(true);
        });
    },
    setAsAdmin : function(email, callback) {
        let sql = "SELECT Role FROM Utilisateur WHERE email = ?";
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