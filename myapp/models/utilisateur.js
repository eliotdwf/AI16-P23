const db = require('./db.js');

module.exports = {
    find: function (email, callback) {
        db.query("select * from Utilisateur where email= ?",email, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getAll: function (callback) {
        db.query("select * from Utilisateur", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    areValid: function (email, mdp, callback) {
        sql = "SELECT 1 FROM Utilisateur WHERE email = ? AND mdp = ?";
        db.query(sql, email, mdp, function (err, results) {
            if (err) throw err;
            if (results.length == 1) {
                callback(true)
            } else {
                callback(false);
            }
        });
    }/*,
    create: function (email, nom, prenom, pwd, type, callback) {
        //todo
        return false;
    }*/
}