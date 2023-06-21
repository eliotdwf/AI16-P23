DROP TABLE IF EXISTS DemandeDevenirRecruteur;
DROP TABLE IF EXISTS DemandeCreationOrga;
DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS OffreEmploi;
DROP TABLE IF EXISTS EtatOffre;
DROP TABLE IF EXISTS TypeContrat;
DROP TABLE IF EXISTS PieceDossier;
DROP TABLE IF EXISTS Utilisateur;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS Organisation;
DROP TABLE IF EXISTS TypeOrganisation;
DROP TABLE IF EXISTS TypeMetier;

CREATE TABLE TypeMetier(
    id_type_metier INT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE TypeOrganisation(
    id_type_organisation INT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

/*CREATE TABLE PieceDossier(
    piece_dossier INT,
    chemin_fichier VARCHAR(100) NOT NULL,
    description_fichier VARCHAR(500),
    PRIMARY KEY(piece_dossier)
);*/
create table PieceDossier
(
    piece_dossier       int auto_increment
        primary key,
    candidature_id      int          not null,
    chemin_fichier      varchar(100) not null,
    description_fichier varchar(500),
    constraint PieceDossier_ibfk_1
        foreign key (candidature_id) references Candidature (candidature_id)
);

create index fk_candidature
    on PieceDossier (candidature_id);

CREATE TABLE Role(
    id_role INT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE EtatOffre(
    id_etat_offre INT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

CREATE TABLE Organisation(
    siren VARCHAR(50),
    nom VARCHAR(50) NOT NULL,
    siege_social VARCHAR(100) NOT NULL,
    description VARCHAR(5000) NOT NULL,
    chemin_logo VARCHAR(100) NOT NULL,
    date_creation DATE NOT NULL DEFAULT curdate(),
    creation_confirmee BOOLEAN NOT NULL DEFAULT false,
    id_type_organisation INT NOT NULL,
    PRIMARY KEY(siren),
    FOREIGN KEY(id_type_organisation) REFERENCES TypeOrganisation(id_type_organisation)
);
/*PRemière version*/
/*CREATE TABLE Utilisateur(
    email VARCHAR(50),
    mdp VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    tel VARCHAR(50),
    date_creation DATE NOT NULL default curdate(),
    actif BOOLEAN default 1,
    id_role INT NOT NULL,
    siren VARCHAR(50),
    PRIMARY KEY(email),
    FOREIGN KEY(siren) REFERENCES Organisation(siren),
    FOREIGN KEY(id_role) REFERENCES Role(id_role)
);*/

create table Utilisateur
(
    email varchar(50) not null
        primary key,
    mdp    varchar(72) not null,
    nom    varchar(50) not null,
    prenom varchar(50) not null,
    tel    varchar(50),
    date_creation date       default curdate() not null,
    actif         tinyint(1) default 1         null,
    id_role       int                          not null,
    siren         varchar(50)                  ,
    constraint Utilisateur_ibfk_1
        foreign key (siren) references Organisation (siren),
    constraint Utilisateur_ibfk_2
        foreign key (id_role) references Role (id_role)
);

create index id_role
    on Utilisateur (id_role);

CREATE TABLE TypeContrat(
    id_type_contrat INT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

CREATE TABLE OffreEmploi(
    id_offre INT AUTO_INCREMENT,
    intitule VARCHAR(75) NOT NULL,
    statut_poste VARCHAR(50) DEFAULT ('Non renseigné'),
    resp_hierarchique VARCHAR(50) DEFAULT ('Non renseigné'),
    lieu_mission VARCHAR(100) NOT NULL,
    rythme VARCHAR(50) NOT NULL,
    salaire VARCHAR(50) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    id_etat_offre INT NOT NULL,
    date_validite DATE NOT NULL,
    pieces_requises_candidature VARCHAR(50) NOT NULL,
    nb_pieces_dossier_candidature INT DEFAULT 0,
    date_creation DATE NOT NULL DEFAULT curdate(),
    date_publication DATE,
    siren VARCHAR(50) NOT NULL,
    id_type_metier INT NOT NULL,
    id_type_contrat INT NOT NULL,
    PRIMARY KEY(id_offre),
    FOREIGN KEY(siren) REFERENCES Organisation(siren),
    FOREIGN KEY(id_type_metier) REFERENCES TypeMetier(id_type_metier),
    FOREIGN KEY(id_etat_offre) REFERENCES EtatOffre(id_etat_offre),
    FOREIGN KEY(id_type_contrat) REFERENCES TypeContrat(id_type_contrat)
);

/*CREATE TABLE Candidature(
    email VARCHAR(50),
    id_offre INT,
    date_candidature DATE NOT NULL,
    PRIMARY KEY(email, id_offre),
    FOREIGN KEY(email) REFERENCES Utilisateur(email),
    FOREIGN KEY(id_offre) REFERENCES OffreEmploi(id_offre)
);*/
create table Candidature
(
    candidature_id   int auto_increment primary key,
    email            varchar(50) not null,
    id_offre         int         ,
    date_candidature date        not null,
    constraint Candidature_ibfk_1
        foreign key (email) references Utilisateur (email)
);

create index id_offre
    on Candidature (id_offre);

CREATE TABLE DemandeCreationOrga(
    email VARCHAR(50),
    date_demande DATE NOT NULL,
    siren VARCHAR(50) NOT NULL,
    PRIMARY KEY(email),
    FOREIGN KEY(email) REFERENCES Utilisateur(email),
    FOREIGN KEY(siren) REFERENCES Organisation(siren)
);

CREATE TABLE DemandeDevenirRecruteur(
    email VARCHAR(50),
    date_demande DATE NOT NULL,
    siren VARCHAR(50) NOT NULL,
    PRIMARY KEY(email),
    FOREIGN KEY(email) REFERENCES Utilisateur(email),
    FOREIGN KEY(siren) REFERENCES Organisation(siren)
);

/*DELIMITER $$
CREATE TRIGGER update_date_publication
    BEFORE UPDATE ON OffreEmploi
    FOR EACH ROW
BEGIN
    IF NEW.id_etat_offre = 2 AND OLD.id_etat_offre = 1 THEN
        SET NEW.date_publication = CURDATE();
    END IF;
END$$
DELIMITER ;*/

