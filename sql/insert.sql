INSERT INTO Candidat(email, mdp, nom, prenom, tel, dateCreation, actif)
VALUES ('candidat1', 'password', 'Doe', 'John', '0123456789', '2023-03-16', true);

INSERT INTO Administrateur(email, mdp, nom, prenom, tel, dateCreation, actif)
VALUES ('admin1@mail.com', 'password', 'Smith', 'Jane', '0987654321', '2023-03-16', true);

INSERT INTO TypeMetier(type_metier, nom)
VALUES (1, 'Développeur');

INSERT INTO TypeOrganisation(type_organisation, nom)
VALUES (1, 'Entreprise');

INSERT INTO PieceDossier(piece_dossier, fichier)
VALUES (1, 'fichier1.pdf');

INSERT INTO Organisation(siren, nom, siege_social, description, type_organisation)
VALUES ('organisation1', 'Entreprise A', '123 rue des entreprises', 'Description de l''entreprise A', 1);

INSERT INTO OffreEmploi(id_offre, intitule, statut_poste, resp_hierarchique, lieu_mission, rythme, salaire, description, etat, date_validite, pieces_requises_candidature, nb_pieces_dossier_candidature, siren, type_metier)
VALUES (1, 'Développeur Full Stack', 'CDI', 'Chef de projet', 'Paris', 'Temps plein', '35000€/an', 'Description de l''offre', 'En cours', '2023-04-30', 'CV, lettre de motivation', 2, 'organisation1', 1);

INSERT INTO Recruteur(email, mdp, nom, prenom, tel, dateCreation, actif, siren)
VALUES ('recruteur1@mail.com', 'password', 'Brown', 'Emma', '0123456789', '2023-03-16', true, 'organisation1');

INSERT INTO Candidature(email, id_offre, piece_dossier, date_candidature)
VALUES ('candidat1', 1, 1, '2023-03-16');

INSERT INTO DemandeCreationOrga(email, date_demande, siren)
VALUES ('candidat1', '2023-03-16', 'organisation1');

INSERT INTO DemandeDevenirRecruteur(email, date_demande, siren)
VALUES ('candidat1', '2023-03-16', 'organisation1');