const db = require('./db.js');

module.exports = {
    insert: function(email, siren, callback) {
        let sql = "INSERT INTO DemandeCreationOrga VALUES (?, curdate(), ?)"
        db.query(sql, [email, siren], function(err, rows) {
            if (err) throw err;
            callback(true);
        })
    },
    refuserCreation: function(siren, email, callback) {
        let sql = `DELETE FROM DemandeCreationOrga WHERE email = ? AND siren = ?`;
        console.log("refuserCreation");
        console.log("siren : " + siren);
        console.log("email : " + email);
        db.query(sql, [email, siren], function(err, rows) {
            if (err) throw err;
            callback(true);
        })
    }
}