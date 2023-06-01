const db = require('./db.js');

module.exports = {
    insert: function(email, siren, callback) {
        let sql = "INSERT INTO DemandeCreationOrga VALUES (?, curdate(), ?)"
        db.query(sql, [email, siren], function(err, rows) {
            if (err) throw err;
            callback(true);
        })
    },
    deleteDemande: function(siren, email, callback) {
        let sql = `DELETE FROM DemandeCreationOrga WHERE email = ? AND siren = ?`;
        db.query(sql, [email, siren], function(err, rows) {
            if (err) throw err;
            callback(true);
        })
    },
    getDemandesByEmail: function(email, callback) {
        let sql = `SELECT DCO.email, O.siren, O.nom, O.id_type_organisation, O.siege_social, 0.chemain_logo, O.description
                    FROM DemandeCreationOrga DCO JOIN Organisation O ON O.siren  = DCO.siren
                    WHERE DCO.email = ?`
        db.query(sql, email, function(err, rows) {
            if (err) throw err;
            if(rows) {
               callback(rows[0]);
            }
            else {
                callback(undefined);
            }
        })
    }
}