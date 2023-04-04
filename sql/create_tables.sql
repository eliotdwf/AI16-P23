DROP TABLE IF EXISTS DemandeDevenirRecruteur;
DROP TABLE IF EXISTS DemandeCreationOrga;
DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS OffreEmploi;
DROP TABLE IF EXISTS PieceDossier;
DROP TABLE IF EXISTS RoleUtilisateur;
DROP TABLE IF EXISTS Utilisateur;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS Organisation;
DROP TABLE IF EXISTS TypeOrganisation;
DROP TABLE IF EXISTS TypeMetier;

CREATE TABLE TypeMetier(
    type_metier INT,
    nom VARCHAR(50) NOT NULL,
    PRIMARY KEY(type_metier)
);

CREATE TABLE TypeOrganisation(
    type_organisation INT,
    nom VARCHAR(50) NOT NULL,
    PRIMARY KEY(type_organisation)
);

CREATE TABLE PieceDossier(
    piece_dossier INT,
    chemin_fichier VARCHAR(100) NOT NULL,
    description_fichier VARCHAR(500),
    PRIMARY KEY(piece_dossier)
);

CREATE TABLE Role(
    id INT,
    nom VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Organisation(
    siren VARCHAR(50),
    nom VARCHAR(50) NOT NULL,
    siege_social VARCHAR(100) NOT NULL,
    description VARCHAR(5000) NOT NULL,
    chemin_logo VARCHAR(100),
    type_organisation INT NOT NULL,
    PRIMARY KEY(siren),
    FOREIGN KEY(type_organisation) REFERENCES TypeOrganisation(type_organisation)
);

CREATE TABLE Utilisateur(
    email VARCHAR(50),
    mdp VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    tel VARCHAR(50),
    dateCreation DATE NOT NULL,
    actif BOOLEAN default 1,
    role INT NOT NULL,
    organisation VARCHAR(50),
    PRIMARY KEY(email),
    FOREIGN KEY(organisation) REFERENCES Organisation(siren)
);

CREATE TABLE OffreEmploi(
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
    organisation VARCHAR(50) NOT NULL,
    type_metier INT,
    PRIMARY KEY(offre_emploi),
    FOREIGN KEY(organisation) REFERENCES Organisation(siren),
    FOREIGN KEY(type_metier) REFERENCES TypeMetier(type_metier)
);

CREATE TABLE Candidature(
    email VARCHAR(50),
    offre_emploi INT,
    piece_dossier INT,
    date_candidature DATE NOT NULL,
    PRIMARY KEY(email, offre_emploi, piece_dossier),
    FOREIGN KEY(email) REFERENCES Utilisateur(email),
    FOREIGN KEY(offre_emploi) REFERENCES OffreEmploi(offre_emploi),
    FOREIGN KEY(piece_dossier) REFERENCES PieceDossier(piece_dossier)
);

CREATE TABLE DemandeCreationOrga(
    email VARCHAR(50),
    date_demande DATE NOT NULL,
    organisation VARCHAR(50) NOT NULL,
    PRIMARY KEY(email),
    FOREIGN KEY(email) REFERENCES Utilisateur(email),
    FOREIGN KEY(organisation) REFERENCES Organisation(siren)
);

CREATE TABLE DemandeDevenirRecruteur(
    email VARCHAR(50),
    date_demande DATE NOT NULL,
    organisation VARCHAR(50) NOT NULL,
    PRIMARY KEY(email),
    FOREIGN KEY(email) REFERENCES Utilisateur(email),
    FOREIGN KEY(organisation) REFERENCES Organisation(siren)
);

CREATE TABLE RoleUtilisateur(
    email VARCHAR(50),
    id INT,
    PRIMARY KEY(email, id),
    FOREIGN KEY(email) REFERENCES Utilisateur(email),
    FOREIGN KEY(id) REFERENCES Role(id)
);
