const db = require('./db.js');

module.exports = {
    create: function (user, candidature, callback) {
        const sql = `INSERT INTO Candidature VALUES (?,?,?,current_date)`
        db.query(sql,[user, candidature, 0], function (err, results) {
            if (err) callback(err.code)
            else callback(results)
        });
    }
}

