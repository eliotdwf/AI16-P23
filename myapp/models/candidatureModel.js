const db = require('./db.js');

module.exports = {
    create: function (user, candidature, callback) {
        const sql = `INSERT INTO Candidature (email, id_offre, date_candidature) VALUES (?,?,current_date)`
        db.query(sql,[user, candidature], function (err, results) {
            if (err) callback(null)
            else callback(results.insertId)
        });
    },
    checkAlreadyCandidat: async function(user, offre, callback) {
        const sql = `SELECT * FROM Candidature WHERE id_offre = ? AND email = ?`;
        db.query(sql, [offre, user], function (err, results) {
            if (err) {callback(null)}
            else {
                if(results.length > 0) callback(true)
                else callback(false)
            }
        })
    },
    delete: function(idCandidature, callback) {
        const sql = `DELETE FROM Candidature WHERE candidature_id = ?`;
        db.query(sql, idCandidature, function(err, results) {
            if(err) callback(null);
            else callback(results)
        })
    },
    find: function(idOffre, candidat, callback) {
        const sql = `SELECT candidature_id FROM Candidature WHERE id_offre = ? AND email = ?`;
        db.query(sql, [idOffre, candidat], function (err, results) {
            if(err) callback(null);
            else {
                if(results.length > 0) {
                    callback(results[0].candidature_id)
                } else {
                    callback(null);
                }
            }
        })
    },
    getCandidatures: function (candidat, callback) {
        const sql = `select OE.id_offre,intitule, date_candidature,statut_poste,lieu_mission,salaire, rythme 
                    from Candidature JOIN OffreEmploi OE on Candidature.id_offre = OE.id_offre
                    WHERE email = ?`;
        db.query(sql, candidat, function(err, results) {
            if(err) callback(null);
            else callback(results)
        })
    },
    getCandidatsParOffre: function(idOffre, callback) {
        let sql = `select email FROM Candidature WHERE id_offre = ?`;
        db.query(sql, idOffre, function (err, results) {
            if(err) callback(null);
            sql = `SELECT email, nom, prenom, tel FROM Utilisateur `;
            if(results !== null && results.length > 0) {
                sql += "WHERE email IN (" + results.map((obj) => "'" + obj.email + "'").join(",") + ")";
            } else {
                sql += "WHERE email IS NULL";
            }
            db.query(sql, function (err, results2) {
                if(err) callback(null);
                callback(results2);
            })
        })
    }
}

