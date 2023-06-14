const db = require('./db.js');
const fs = require('fs');

module.exports = {
    create: function(candidature_id, filename, description, callback) {
        try {
            const sql = "INSERT INTO PieceDossier (candidature_id, chemin_fichier, description_fichier) VALUES(?, ?, ?)";
            db.query(sql, [candidature_id, filename, description], function(err, results) {
                if(err){
                    callback(false)
                } else {
                    callback(true)
                }
            })
        } catch (err) {
            callback(false)
        }
    },
    delete: function (id_candidature, callback) {
        const piecesql = `SELECT chemin_fichier FROM PieceDossier WHERE candidature_id = ?`;
        db.query(piecesql, id_candidature, function(err, results) {
            console.log(err);
            if(err){
                callback(false)
            } else {
                for(let el of results) {
                    fs.rm("./public/files/"+el.chemin_fichier, function(results) {
                        if(err) callback(false)
                    });
                }
            }
        })
        const sql = `DELETE FROM PieceDossier WHERE candidature_id = ?`;
        db.query(sql, id_candidature, function(err, results) {
            if(err){
                callback(false)
            } else {
                callback(results)
            }
        })
    }
}