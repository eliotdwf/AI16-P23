INSERT INTO Role VALUES (1, "Candidat");
INSERT INTO Role VALUES (2, "Recruteur");
INSERT INTO Role VALUES (3, "Administrateur");
INSERT INTO Utilisateur VALUES("candidat@mail.fr", "mdp", "toto", "francis", "0606060606", curdate(), 1, 1, NULL);
INSERT INTO Utilisateur VALUES("eliot@mail.fr", "mdp", "Dewulf", "Eliot", "0606060606", curdate(), 1, 3, NULL);


INSERT INTO TypeOrganisation(1, "entreprise");
INSERT INTO TypeOrganisation(2, "association");

INSERT INTO Organisation VALUES("1234", "Carrefour", "Paris", "Vente de produit de première nécéssité", "Logo_Carrefour.png", 1);

INSERT INTO Utilisateur VALUES("recruteur@mail.fr", "mdp", "Dupont", "Albert", "0606060606", curdate(), 1, 2, "1234");