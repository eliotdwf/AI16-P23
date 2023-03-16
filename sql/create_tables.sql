DROP TABLE DemandeDevenirRecruteur;
DROP TABLE DemandeCreationOrga;
DROP TABLE Candidature;
DROP TABLE Recruteur;
DROP TABLE OffreEmploi;
DROP TABLE Organisation;
DROP TABLE PieceDossier;
DROP TABLE TypeOrganisation;
DROP TABLE TypeMetier;
DROP TABLE Administrateur;
DROP TABLE Candidat;


CREATE OR REPLACE TABLE Candidat(
   candidat VARCHAR(50),
   mdp VARCHAR(50) NOT NULL,
   nom VARCHAR(50) NOT NULL,
   prenom VARCHAR(50) NOT NULL,
   tel VARCHAR(50),
   dateCreation DATE NOT NULL,
   actif BOOLEAN,
   PRIMARY KEY(candidat)
);

CREATE OR REPLACE TABLE Administrateur(
   email VARCHAR(50),
   mdp VARCHAR(50) NOT NULL,
   nom VARCHAR(50) NOT NULL,
   prenom VARCHAR(50) NOT NULL,
   tel VARCHAR(50),
   dateCreation DATE NOT NULL,
   actif BOOLEAN,
   PRIMARY KEY(email)
);

CREATE OR REPLACE TABLE TypeMetier(
   type_metier INT,
   nom VARCHAR(50) NOT NULL,
   PRIMARY KEY(type_metier)
);

CREATE OR REPLACE TABLE TypeOrganisation(
   type_organisation INT,
   nom VARCHAR(50) NOT NULL,
   PRIMARY KEY(type_organisation)
);

CREATE OR REPLACE TABLE PieceDossier(
   piece_dossier INT,
   fichier BLOB NOT NULL,
   PRIMARY KEY(piece_dossier)
);

CREATE OR REPLACE TABLE Organisation(
   siren VARCHAR(50),
   nom VARCHAR(50) NOT NULL,
   siege_social VARCHAR(100) NOT NULL,
   description VARCHAR(5000) NOT NULL,
   type_organisation INT NOT NULL,
   PRIMARY KEY(siren),
   FOREIGN KEY(type_organisation) REFERENCES TypeOrganisation(type_organisation)
);

CREATE OR REPLACE TABLE OffreEmploi(
   offre_emploi INT,
   intitule VARCHAR(50) NOT NULL,
   statut_poste VARCHAR(50) NOT NULL,
   resp_hierarchique VARCHAR(50),
   lieu_mission VARCHAR(100) NOT NULL,
   rythme VARCHAR(50) NOT NULL,
   salaire VARCHAR(50) NOT NULL,
   description VARCHAR(1000) NOT NULL,
   etat VARCHAR(50) NOT NULL,
   date_validite DATE NOT NULL,
   pieces_requises_candidature VARCHAR(50) NOT NULL,
   nb_pieces_dossier_candidature INT NOT NULL,
   siren VARCHAR(50) NOT NULL,
   type_metier INT,
   PRIMARY KEY(offre_emploi),
   FOREIGN KEY(siren) REFERENCES Organisation(siren),
   FOREIGN KEY(type_metier) REFERENCES TypeMetier(type_metier)
);

CREATE OR REPLACE TABLE Recruteur(
   email VARCHAR(50),
   mdp VARCHAR(50) NOT NULL,
   nom VARCHAR(50) NOT NULL,
   prenom VARCHAR(50) NOT NULL,
   tel VARCHAR(50),
   dateCreation DATE NOT NULL,
   actif BOOLEAN,
   siren VARCHAR(50) NOT NULL,
   PRIMARY KEY(email),
   FOREIGN KEY(siren) REFERENCES Organisation(siren)
);

CREATE OR REPLACE TABLE Candidature(
   candidat VARCHAR(50),
   offre_emploi INT,
   piece_dossier INT,
   date_candidature DATE NOT NULL,
   PRIMARY KEY(candidat, offre_emploi, piece_dossier),
   FOREIGN KEY(candidat) REFERENCES Candidat(candidat),
   FOREIGN KEY(offre_emploi) REFERENCES OffreEmploi(offre_emploi),
   FOREIGN KEY(piece_dossier) REFERENCES PieceDossier(piece_dossier)
);

CREATE OR REPLACE TABLE DemandeCreationOrga(
   candidat VARCHAR(50),
   date_demande DATE NOT NULL,
   siren VARCHAR(50) NOT NULL,
   PRIMARY KEY(candidat),
   FOREIGN KEY(candidat) REFERENCES Candidat(candidat),
   FOREIGN KEY(siren) REFERENCES Organisation(siren)
);

CREATE OR REPLACE TABLE DemandeDevenirRecruteur(
   candidat VARCHAR(50),
   date_demande DATE NOT NULL,
   siren VARCHAR(50) NOT NULL,
   PRIMARY KEY(candidat),
   FOREIGN KEY(candidat) REFERENCES Candidat(candidat),
   FOREIGN KEY(siren) REFERENCES Organisation(siren)
);
