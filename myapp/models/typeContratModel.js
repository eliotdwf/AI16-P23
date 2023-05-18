const db = require('./db.js');
module.exports = {
    getAll: function(callback) {
        let sql = "select * from TypeContrat"
        db.query(sql, function(err, rows) {
            if (err) throw err;
            callback(rows);
        })
    }
}