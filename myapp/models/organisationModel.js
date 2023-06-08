const db = require('./db.js');

module.exports = {
    getOrgasCrees: function(typeOrga ='%%', callback) {
        const sql = `SELECT O.siren, O.nom, O.id_type_organisation FROM Organisation O
                    WHERE O.id_type_organisation LIKE ? AND O.creation_confirmee = true`;
        db.query(sql, typeOrga, function(err, results) {
            if(err) throw err;
            callback(results);
        })
    },
    getOrgasNonCrees: function(typeOrga = "%%", callback) {
        let sql = `SELECT O.siren, O.nom, O.siege_social, TypeO.nom AS type_organisation, 
                    DCO.date_demande AS date_demande_creation, DCO.email AS createur
                    FROM DemandeCreationOrga DCO INNER JOIN Organisation O ON DCO.siren = O.siren
                    INNER JOIN TypeOrganisation TypeO ON TypeO.id_type_organisation = O.id_type_organisation
                    WHERE O.id_type_organisation LIKE ? AND O.creation_confirmee = false`;
        db.query(sql, typeOrga, function (err, results) {
            if (err) throw err;
            callback(results);
        })
    },
    findBySiren: function (siren, callback) {
        let sql = "select * from Organisation where siren = ?";
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
        let sql = `SELECT 1 FROM Organisation WHERE siren = ?`;
        db.query(sql, siren, function (err, result) {
            if (err) throw err;
            if(result) {
                console.log(result[0])
                callback(result[0]);
            }
            else {
                console.log(result)
                callback(result);
            }

        });
    },
    create: function (siren, nom, siege, description, logo, type, callback) {
        let sql = "INSERT INTO Organisation VALUES(?, ?, ?, ?, ?, curdate(), false, ?)";
        db.query(sql, [siren, nom, siege, description, logo, type], function (err) {
            if(err) throw err;
            callback(true);
        })
    },
    confirmerCreation: function (siren, callback) {
        const sql = "UPDATE Organisation SET creation_confirmee = true WHERE siren=?";
        db.query(sql, siren, function(err, result) {
            if(err) throw err;
            callback(true);
        })
    },
    delete: function(siren, callback) {
        const sql = "DELETE FROM Organisation WHERE siren=?";
        db.query(sql, siren, function(err, result) {
            if(err) throw err;
            callback(true);
        })
    },
    getCheminLogo: function(siren, callback) {
        const sql = `SELECT chemin_logo FROM Organisation WHERE siren = ?`
        db.query(sql, siren, function(err, rows) {
            if(err) throw err;
            if(rows){
                callback(rows[0].chemin_logo);
            }
            else {
                callback(undefined);
            }
        })
    }
}