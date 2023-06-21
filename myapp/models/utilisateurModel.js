const db = require('./db.js');
const bcrypt = require('bcrypt')

module.exports = {
    findById: function (email, callback) {
        let sql = "select * from Utilisateur where email = ?";
        db.query(sql, email, function (err, results) {
            if (err) throw err;
            if(results[0]){
                callback(results[0]);
            }
            else {
                callback(undefined);
            }
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
        let sql = `select * from Utilisateur WHERE actif LIKE ? AND id_role LIKE ?`
        db.query(sql, [actif, role], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    isValid: function (email, mdp, callback) {
        let sql = "SELECT id_role, mdp FROM Utilisateur WHERE email = ? AND actif = True";
        db.query(sql, [email, mdp], function (err, result) {
            if (err) throw err;
            if(result[0]){
                bcrypt.compare(mdp, result[0].mdp, function(err, ok) {
                    if(ok) callback(result[0].id_role);
                    else callback(undefined)
                });
            }
            else {
                callback(undefined);
            }
        });
    },
    isUsedEmail: function (email, callback) {
        let sql = "SELECT 1 FROM Utilisateur WHERE email = ?";
        db.query(sql, email, function (err, result) {
            if (err) callback(null);
            callback(result[0]);
        });
    },
    create: function (email, pwd, nom, prenom, tel, callback) {
        bcrypt.hash(pwd, 10, function(err, hash) {
            let sql = "INSERT INTO Utilisateur VALUES(?, ?, ?, ?, ?, curdate(), 1, 1, null)";
            db.query(sql, [email, hash, nom, prenom, tel], function (err, results) {
                if(err) {
                    callback(null);
                } else {
                    callback(true);
                }
            })
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
    },
    devenirRecruteur: function(email, siren, callback) {
        let sql = "UPDATE Utilisateur SET siren = ?, id_role = 2 WHERE email = ?";
        db.query(sql, [siren, email], function(err, result) {
            //TODO : supprimer les candidatures de l'ancien candidat, les demandes de création d'orga + les demandes pour devenir recruteur
            if(err) throw err;
            callback(true);
        })
    }
}