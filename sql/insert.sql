INSERT INTO Role VALUES (1, "Candidat");
INSERT INTO Role VALUES (2, "Recruteur");
INSERT INTO Role VALUES (3, "Administrateur");
INSERT INTO Utilisateur VALUES("candidat@mail.fr", "mdp", "toto", "francis", "0606060606", curdate(), 1, 1, NULL);
INSERT INTO Utilisateur VALUES("candidat2@mail.fr", "mdp", "albert", "Vandam", "0606060606", curdate(), 1, 1, NULL);
INSERT INTO Utilisateur VALUES("candidat3@mail.fr", "mdp", "Bidule", "Farfadet", "0606060606", curdate(), 1, 1, NULL);
INSERT INTO Utilisateur VALUES("candidat4@mail.fr", "mdp", "Zigzag", "Zinzin", "0606060606", curdate(), 1, 1, NULL);
INSERT INTO Utilisateur VALUES("candidat5@mail.fr", "mdp", "Totoche", "Trouillard", "0606060606", curdate(), 1, 1, NULL);
INSERT INTO Utilisateur VALUES("candidat6@mail.fr", "mdp", "Gribouille", "Vandam", "0606060606", curdate(), 1, 1, NULL);
INSERT INTO Utilisateur VALUES("eliot@mail.fr", "mdp", "Dewulf", "Eliot", "0606060606", curdate(), 1, 3, NULL);
INSERT INTO Utilisateur VALUES("admin@mail.fr", "mdp", "Admin", "Admin", "0606060606", curdate(), 1, 3, null);

INSERT INTO TypeOrganisation VALUES(1, "entreprise");
INSERT INTO TypeOrganisation VALUES(2, "association");

INSERT INTO Organisation VALUES("1234", "Carrefour", "Paris", 'Carrefour est une entreprise multinationale française spécialisée dans la grande distribution. Fondée en 1959, elle est devenue l''un des plus grands détaillants au monde, opérant dans plus de 30 pays et desservant des millions de clients chaque jour.\n
Carrefour propose une large gamme de produits, y compris des produits alimentaires, des produits d''hygiène et de beauté, des produits électroniques, des vêtements, des articles ménagers et bien plus encore. Ses magasins sont généralement organisés en différents formats, tels que les hypermarchés, les supermarchés, les magasins de proximité et les sites de commerce électronique.\n
Les hypermarchés Carrefour sont les plus grands formats de magasins proposés par l''entreprise. Ils offrent une grande variété de produits et de services sous un même toit, allant des produits d''épicerie aux appareils électroménagers, aux produits électroniques, aux vêtements, aux jouets et bien plus encore. Ces magasins sont souvent situés en périphérie des villes et proposent également des services tels que les stations-service, les cafés, les restaurants et les espaces de loisirs.\n
Les supermarchés Carrefour sont des magasins de taille moyenne offrant une sélection plus restreinte de produits par rapport aux hypermarchés, mais avec une plus grande proximité pour les consommateurs. Ils se concentrent généralement sur les produits d''épicerie, les produits frais, les produits de soins personnels et les articles ménagers.\n
Les magasins de proximité Carrefour, tels que Carrefour City, sont de plus petite taille et se trouvent principalement dans les zones urbaines. Ils sont conçus pour répondre aux besoins de base des consommateurs en proposant une sélection de produits alimentaires, de boissons, de produits de soins personnels et d''autres articles essentiels.\n
En plus de ses magasins physiques, Carrefour s''est également développé dans le commerce électronique pour répondre aux besoins des clients en ligne. Elle propose des services de livraison à domicile et de retrait en magasin, permettant aux clients de faire leurs achats en ligne et de choisir la méthode de récupération qui leur convient le mieux.\n
Carrefour s''engage également dans des initiatives de responsabilité sociale et environnementale. L''entreprise met en œuvre des mesures visant à réduire son empreinte écologique, à promouvoir des pratiques commerciales durables et à soutenir des causes sociales, telles que l''aide alimentaire, l''éducation et l''emploi\n
En résumé, Carrefour est une entreprise de grande distribution d''envergure mondiale, offrant une large gamme de produits et de services à ses clients à travers ses différents formats de magasins. Elle s''efforce également de promouvoir la durabilité et de contribuer positivement à la société.', "Logo_Carrefour.png", curdate(), false,  1);

INSERT INTO Organisation VALUES("5678", "Amazon", "Nantes", 'Amazon est une entreprise multinationale américaine de commerce électronique et de services cloud, fondée en 1994 par Jeff Bezos. Au fil des ans, elle est devenue l''une des plus grandes entreprises au monde, offrant une variété de produits et de services à des millions de clients dans le monde entier.\n
Le cœur de métier d''Amazon est le commerce électronique. La société exploite plusieurs sites Web de vente en ligne dans le monde entier, proposant une large gamme de produits, tels que des produits électroniques, des livres, des vêtements, des produits d''épicerie, des jouets, des produits de beauté et bien plus encore. Les clients peuvent acheter des produits directement auprès d''Amazon ou de vendeurs tiers présents sur la plateforme.\n
Outre le commerce électronique, Amazon offre également des services cloud, tels que Amazon Web Services (AWS), qui permettent aux entreprises et aux organisations de stocker des données et d''exécuter des applications sur le cloud. AWS est devenu l''un des principaux fournisseurs de services cloud au monde.\n
Amazon propose également des services de streaming, tels qu''Amazon Prime Video et Amazon Music, permettant aux clients d''accéder à un large éventail de contenu vidéo et musical en ligne. Elle a également lancé plusieurs dispositifs, tels que le Kindle, une liseuse électronique, et l''Echo, un haut-parleur intelligent activé par la voix, qui permettent aux clients d''interagir avec ses services.\n
En plus de ses activités commerciales, Amazon est également engagée dans des initiatives de responsabilité sociale et environnementale. L''entreprise s''est fixé des objectifs ambitieux de développement durable, tels que la réduction de ses émissions de carbone, la compensation de ses émissions de gaz à effet de serre et l''utilisation de l''énergie renouvelable.\n
En résumé, Amazon est une entreprise de commerce électronique et de services cloud mondiale offrant une large gamme de produits et de services à ses clients. Elle s''est également engagée à promouvoir la durabilité et à contribuer positivement à la société.', "Logo_Amazon.png", curdate(), false, 1);

INSERT INTO TypeMetier VALUES
    (1, 'Informatique'),
    (2, 'Restauration'),
    (3, 'Cybersécurité'),
    (4, 'Marketing'),
    (5, 'Finance'),
    (6, 'Ressources humaines'),
    (7, 'Ingénierie'),
    (8, 'Enseignement'),
    (9, 'Santé'),
    (10, 'Communication'),
    (11, 'Design'),
    (12, 'Juridique'),
    (13, 'Logistique'),
    (14, 'Journalisme'),
    (15, 'Commerce'),
    (16, 'Ingénierie mécanique'),
    (17, 'Artisanat'),
    (18, 'Administration'),
    (19, 'Tourisme'),
    (20, 'Développement durable');


INSERT INTO EtatOffre VALUES (1, 'Non publiée'), (2, 'Publiée'), (3, 'Expirée');
INSERT INTO TypeContrat VALUES (1, 'CDI'), (2, 'CDD'), (3, 'Stage'), (4, 'Alternance'), (5, 'Interim');

INSERT INTO OffreEmploi (id_offre, intitule, statut_poste, resp_hierarchique, lieu_mission, rythme, salaire, description, id_etat_offre, date_validite, pieces_requises_candidature, nb_pieces_dossier_candidature, date_creation, date_publication, siren, id_type_metier, id_type_contrat)
VALUES
(1, 'Assistant(e) logistique', 'Cadre', 'Responsable logistique', 'Paris', 'Temps plein', 'À discuter', 'Nous recherchons un(e) assistant(e) logistique pour soutenir nos opérations logistiques à Paris. Le candidat idéal doit avoir une connaissance des procédures logistiques et être capable de travailler dans un environnement dynamique.', 2, '2024-09-30', 'CV, lettre de motivation', 2, '2023-01-12', '2023-01-13','5678', 13, 1),
(2, 'Responsable marketing', 'Cadre', 'Directeur marketing', 'Lyon', 'Temps plein', 'À discuter', 'Nous recherchons un(e) responsable marketing passionné(e) pour développer et mettre en œuvre des stratégies de marketing innovantes. Le candidat idéal doit avoir une solide expérience en marketing et être capable de gérer une équipe.', 2, '2024-10-05', 'CV, lettre de motivation', 2, '2023-01-15', '2023-01-16', '5678', 4, 1),
(3, 'Développeur(euse) web', 'Technicien', 'Chef d''équipe développement', 'Marseille', 'Temps plein', 'À discuter', 'Nous recherchons un(e) développeur(euse) web talentueux(se) pour rejoindre notre équipe de développement à Marseille. Le candidat idéal doit maîtriser les langages de programmation web et être capable de créer des sites web dynamiques et conviviaux.', 1, '2023-10-10', 'CV, lettre de motivation', 2, curdate(), null, '5678', 1, 1),
(4, 'Chef de projet RH', 'Cadre', 'Directeur des ressources humaines', 'Bordeaux', 'Temps plein', 'À discuter', 'Nous recherchons un(e) chef de projet RH expérimenté(e) pour gérer et coordonner nos initiatives en matière de ressources humaines. Le candidat idéal doit avoir une solide compréhension des processus RH et des compétences en gestion de projet.', 1, '2023-10-15', 'CV, lettre de motivation', 2, curdate(), null, '5678', 6, 1),
(5, 'Commercial(e) B2B', 'Cadre', 'Responsable commercial', 'Lille', 'Temps plein', 'À discuter', 'Nous recherchons un(e) commercial(e) expérimenté(e) pour développer notre clientèle B2B dans la région de Lille. Le candidat idéal doit avoir une expérience réussie dans la vente B2B et de solides compétences en négociation.', 1, '2023-10-20', 'CV, lettre de motivation', 2, curdate(), null, '5678', 15, 1),
(6, 'Spécialiste en cybersécurité', 'Technicien', 'Responsable de la sécurité informatique', 'Paris', 'Temps plein', 'À discuter', 'Nous recherchons un(e) spécialiste en cybersécurité pour renforcer notre équipe de sécurité informatique à Paris. Le candidat idéal doit avoir une expertise en matière de sécurité des systèmes et des réseaux.', 1, '2023-10-25', 'CV, lettre de motivation', 2, curdate(), null, '5678', 3, 1),
(7, 'Enseignant(e) en ligne', 'Salarié', 'Coordinateur pédagogique', 'Toulouse', 'Temps partiel', 'À discuter', 'Nous recherchons un(e) enseignant(e) en ligne passionné(e) pour rejoindre notre équipe pédagogique à Toulouse. Le candidat idéal doit avoir une expérience dans l''enseignement en ligne et maîtriser les outils et les méthodes d''apprentissage à distance.', 1, '2023-10-30', 'CV, lettre de motivation', 2, curdate(), null, '5678', 8, 1),
(8, 'Infirmier(ère) en santé au travail', 'Salarié', 'Médecin du travail', 'Lyon', 'Temps plein', 'À discuter', 'Nous recherchons un(e) infirmier(ère) en santé au travail qualifié(e) pour assurer le suivi médical de nos employés à Lyon. Le candidat idéal doit avoir une connaissance approfondie des pratiques de santé au travail et être titulaire d''un diplôme d''infirmier(ère).', 1, '2023-11-05', 'CV, lettre de motivation', 2, curdate(), null, '5678', 9, 1);


INSERT INTO Utilisateur VALUES("carrefour@mail.fr", "mdp", "Recruteur", "Carrefour", "0606060606", curdate(), 1, 2, "1234");
INSERT INTO Utilisateur VALUES("amazon@mail.fr", "mdp", "Recruteur", "Amazon", "0606060606", curdate(), 1, 2, "5678");

INSERT INTO DemandeCreationOrga VALUES("candidat2@mail.fr", curdate(), "1234");
INSERT INTO DemandeDevenirRecruteur VALUES ("candidat2@mail.fr", curdate(), "5678");
INSERT INTO DemandeDevenirRecruteur VALUES ("candidat3@mail.fr", curdate(), "5678");
INSERT INTO DemandeDevenirRecruteur VALUES ("candidat4@mail.fr", curdate(), "5678");
INSERT INTO DemandeDevenirRecruteur VALUES ("candidat5@mail.fr", curdate(), "5678");
INSERT INTO DemandeDevenirRecruteur VALUES ("candidat6@mail.fr", curdate(), "5678");