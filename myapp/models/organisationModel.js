const db = require('./db.js');

module.exports = {
    findBySiren: function (siren, callback) {
        sql = "select * from Organisation where siren = ?";
        db.query(sql,siren, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getAll: function (callback) {
        db.query('select * from Utilisateur', function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    isUsedSiren: function (siren, callback) {
        sql = "SELECT 1 FROM Organisation WHERE siren = ?";
        db.query(sql, siren, function (err, result) {
            if (err) throw err;
            callback(result[0]);
        });
    },
    create: function (siren, nom, siege, description, logo, type, callback) {
        sql = "INSERT INTO Organisation VALUES(?, ?, ?, ?, ?, curdate(), ?)";
        db.query(sql, [siren, nom, siege, description, logo, type], function (err) {
            if(err) throw err;
            callback(true);
        })
    }
}