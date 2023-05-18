const db = require('./db.js');

module.exports = {
    findBySiren: function (siren, callback) {
        sql = "select * from Organisation where siren = ?";
        db.query(sql,siren, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getDescriptionBySiren: function(siren, callback) {
        let sql = `SELECT O.description, T.nom
                   FROM Organisation O
                   INNER JOIN TypeOrganisation T on O.id_type_organisation = T.id_type_organisation
                   WHERE O.siren = ?`;
        db.query(sql,siren, function (err, results) {
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