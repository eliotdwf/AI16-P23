const db = require('./db.js');

module.exports = {
    insert: function(email, siren, callback) {
        let sql = "INSERT INTO DemandeCreationOrga VALUES (?, curdate(), ?)"
        db.query(sql, [email, siren], function(err, rows) {
            if (err) throw err;
            callback(true);
        })
    }
}