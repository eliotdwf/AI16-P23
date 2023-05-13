const db = require('./db.js');

module.exports = {
    find: function (siren, callback) {
        db.query("select * from OffreEmploi where siren= ?",siren, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getProfilsOffres: function (etatOffre = "%%", callback) {
        let sql =`select id_offre, intitule, lieu_mission, id_etat_offre, O.chemin_logo
                    from OffreEmploi INNER JOIN Organisation O ON O.siren = OffreEmploi.siren
                    WHERE id_etat_offre LIKE '${etatOffre}'`;
        db.query(sql, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    isUsedSiren: function (siren, callback) {
        let sql = "SELECT 1 FROM OffreEmploi WHERE siren = ?";
        db.query(sql, siren, function (err, result) {
            if (err) throw err;
            callback(result[0]);
        });
    },
    create: function (id_offre, intitule, statut_poste, resp_hierarchique, lieu_mission, rythme, salaire, description, id_etat_offre, date_validite, pieces_requises_candidature, nb_pieces_dossier_candidature, siren, id_type_metier, id_type_contrat, callback) {
        let sql = "INSERT INTO OffreEmploi VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [id_offre, intitule, statut_poste, resp_hierarchique, lieu_mission, rythme, salaire, description, id_etat_offre, date_validite, pieces_requises_candidature, nb_pieces_dossier_candidature, siren, id_type_metier, id_type_contrat], function (err) {
            if(err) throw err;
            callback(true);
        })
    }
}