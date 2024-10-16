const db = require('./db.js');



module.exports = {
    findById: function (id_offre, callback) {
        const sql = `select OE.id_offre, OE.intitule, OE.statut_poste, OE.resp_hierarchique, OE.lieu_mission, OE.rythme,
                        OE.salaire, OE.description, EO.id_etat_offre, EO.libelle AS etat_offre, OE.date_validite, 
                        OE.pieces_requises_candidature, OE.siren, TM.id_type_metier, TM.nom AS type_metier, 
                        TC.id_type_contrat, TC.libelle AS type_contrat, O.nom AS nom_orga, O.siege_social, 
                        O.description AS description_orga, O.chemin_logo, O.date_creation AS date_creation_orga, 
                        TypeO.nom AS type_organisation
                        from OffreEmploi OE INNER JOIN Organisation O ON O.siren = OE.siren
                        INNER JOIN EtatOffre EO ON OE.id_etat_offre = EO.id_etat_offre
                        INNER JOIN TypeMetier TM ON OE.id_type_metier = TM.id_type_metier
                        INNER JOIN TypeContrat TC ON OE.id_type_contrat = TC.id_type_contrat
                        INNER JOIN TypeOrganisation TypeO ON TypeO.id_type_organisation = O.id_type_organisation
                        where id_offre = ?`
        db.query(sql,id_offre, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    deleteById: function(id_offre, callback) {
        const sql = "DELETE FROM OffreEmploi WHERE id_offre = ?";
        db.query(sql, id_offre, function(err, results) {
            if(err) throw err;
            callback(results);
        })
    },
    updateById: function(id, intitule, lieu_mission, rythme, salaire, description, id_etat_offre, date_validite,
                         pieces_requises_candidature, id_type_metier, id_type_contrat, callback) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        let datePublication = (id_etat_offre == 2) ? today : null;
        const sql = `UPDATE OffreEmploi SET intitule=?, lieu_mission=?, rythme=?, salaire=?, description=?, id_etat_offre=?, 
                       date_validite=?, pieces_requises_candidature=?, date_publication=?, id_type_metier=?, id_type_contrat=?
                       WHERE id_offre=?`
        db.query(sql, [ intitule, lieu_mission, rythme, salaire, description, id_etat_offre, date_validite,
            pieces_requises_candidature, datePublication, id_type_metier, id_type_contrat, id], function(err, results) {
            if(err) throw err;
            callback(results);
        })
    },
    getProfilsOffresFiltres: function (role, siren = "%%",
                                etatOffre = "%%",
                                tri,
                                filtres,
                                callback) {
        let sql =`select id_offre, intitule, lieu_mission, EO.id_etat_offre, EO.libelle AS etat, 
                    O.chemin_logo, O.nom AS nom_orga
                    from OffreEmploi INNER JOIN Organisation O ON O.siren = OffreEmploi.siren
                    INNER JOIN EtatOffre EO ON OffreEmploi.id_etat_offre = EO.id_etat_offre
                    WHERE EO.id_etat_offre LIKE ? AND O.siren LIKE ?`;

        filtres.tm !== "0" ? sql += ` AND id_type_metier = ?` : sql += " AND id_type_metier != ?";
        filtres.tc !== "0" ? sql += ` AND id_type_contrat = ?` : sql += " AND id_type_contrat != ?";

        if(role === 1) {
            sql += " ORDER BY OffreEmploi.date_publication";
            if(tri !== undefined && tri === "2") sql += " DESC"; //la + récente en premier
        }
        else {  //recruteur
            sql += " ORDER BY OffreEmploi.date_creation";
            if(tri !== undefined && tri === "2") sql += " DESC";
        }
        db.query(sql, [etatOffre, siren, filtres.tm, filtres.tc], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getProfilsOffres: function (role, siren = "%%",
                                etatOffre = "%%",
                                tri,
                                callback) {
        let sql =`select id_offre, intitule, lieu_mission, EO.id_etat_offre, EO.libelle AS etat, 
                    O.chemin_logo, O.nom AS nom_orga
                    from OffreEmploi INNER JOIN Organisation O ON O.siren = OffreEmploi.siren
                    INNER JOIN EtatOffre EO ON OffreEmploi.id_etat_offre = EO.id_etat_offre
                    WHERE EO.id_etat_offre LIKE ? AND O.siren LIKE ?`;
        //TODO : gerer le filtre

        if(role === 1) {    //candidat
            sql += " AND EO.id_etat_offre=2 ORDER BY OffreEmploi.date_publication";
            if(tri !== undefined && tri === "2") sql += " DESC";
        }
        else {  //recruteur
            sql += " ORDER BY OffreEmploi.date_creation";
            if(tri !== undefined && tri === "2") sql += " DESC";
        }
        db.query(sql, [etatOffre, siren], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getPieceOffre: function(id, callback) {
        let sql = "SELECT pieces_requises_candidature FROM OffreEmploi WHERE id_offre = ?";
        db.query(sql, id, function (err, result) {
            console.log(sql + " " + id)
            console.log("RESULTATS " + result)
            if (err) throw err;
            if(result.length === 0){
                callback(undefined);
            }
            else {
                console.log(result);
                callback(result[0]["pieces_requises_candidature"].split(","));
            }

        });
    },
    isUsedId: function (id, callback) {
        let sql = "SELECT 1 FROM OffreEmploi WHERE id_offre = ?";
        db.query(sql, id, function (err, result) {
            if (err) throw err;
            callback(result[0]);
        });
    },
    getSirenById: function(id, callback) {
        let sql = "SELECT siren FROM OffreEmploi WHERE id_offre = ?";
        db.query(sql, id, function (err, results) {
            if (err) throw err;
            if(results[0]){
                callback(results[0].siren);
            }
            else {
                callback(undefined);
            }
        });
    },
    create: function (intitule, lieuMission, rythme, salaire, description, dateValidite, piecesCandidatures, siren,
                      idTypeMetier, idTypeContrat, idEtatOffre, callback) {
        let sql = `INSERT INTO OffreEmploi (intitule, lieu_mission, rythme, salaire, description, id_etat_offre,
                    date_validite, pieces_requises_candidature, date_creation, date_publication, siren, id_type_metier, 
                    id_type_contrat) VALUES(?, ?, ?, ?, ?, 2, ?, ?, curdate(), curdate(), ?, ?, ?)`;
        if(idEtatOffre == 1) {
            //offre non publiee, brouillon, on ne met pas de date de creation
            sql = `INSERT INTO OffreEmploi (intitule, lieu_mission, rythme, salaire, description, id_etat_offre,
                    date_validite, pieces_requises_candidature, date_creation, siren, id_type_metier, id_type_contrat) 
                    VALUES(?, ?, ?, ?, ?, 1, ?, ?, curdate(), ?, ?, ?)`;
        }
        db.query(sql, [intitule, lieuMission, rythme, salaire, description, dateValidite, piecesCandidatures,
            siren, idTypeMetier, idTypeContrat], function (err) {
            if(err) throw err;
            callback(true);
        })
    },
    getFiltres: function(callback) {
        let sqlTypeMetier = `SELECT id_type_metier, nom FROM TypeMetier;`
        db.query(sqlTypeMetier, function(err, typeMetier) {
            let dict = {
                typesMetier: [],
                typesContrat: []
            }
            if(err) callback(null)
            else {
                dict.typesMetier = typeMetier;
                let sqlTypeContrat = `SELECT id_type_contrat, libelle FROM TypeContrat;`
                db.query(sqlTypeContrat, function(err, typeContrat) {
                    if(err) callback(null)
                    else {
                        dict.typesContrat = typeContrat;
                        callback(dict)
                    }
                })
            }
        })
    }

}