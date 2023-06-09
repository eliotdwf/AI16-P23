const db = require('./db.js');

module.exports = {
    insert: function(email, siren, callback) {
        let sql = "INSERT INTO DemandeDevenirRecruteur VALUES (?, curdate(), ?)"
        db.query(sql, [email, siren], function(err, rows) {
            if (err) throw err;
            callback(true);
        })
    },
    getByEmail: function(email, callback) {
        let sql = "SELECT email, date_demande, siren FROM DemandeDevenirRecruteur WHERE email = ?"
        db.query(sql, email, function(err, rows) {
            if (err) throw err;
            if(rows) {
                callback(rows[0]);
            }
            else {
                callback(undefined);
            }
        })
    },
    delete: function(email, siren, callback) {
        let sql = `DELETE FROM DemandeDevenirRecruteur WHERE email = ? AND siren = ?`;
        db.query(sql, [email, siren], function(err, rows) {
            if (err) callback(false);
            else callback(true);
        })
    }
}