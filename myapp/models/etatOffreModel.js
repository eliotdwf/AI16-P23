const db = require('./db.js');
module.exports = {
    getAll: function(callback) {
        let sql = "select * from EtatOffre"
        db.query(sql, function(err, rows) {
            if (err) throw err;
            callback(rows);
        })
    }
}