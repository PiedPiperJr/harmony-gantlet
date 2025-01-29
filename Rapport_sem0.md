# Rapport Hebdomadaire N°0 : Étude de l'existant et établissement du plan de travail  
*28/10/2024*

## Introduction

Dans le cadre de la réalisation du projet **Harmony Gloves**, notre équipe a tenu à cerner, pour mieux délimiter le périmètre du travail à abattre, les travaux similaires existants, leurs performances ainsi que la portée du projet. Au terme de cette première semaine, nous avons effectué une étude de l'existant, ainsi que l'établissement de la feuille de route pour la réalisation du projet.

## Objectifs

L'objectif de cette première semaine était d'étudier ce qui se fait déjà en matière de traduction de la langue des signes en texte via l'utilisation de capteurs d'une part, et d'autre part, de faire une planification réaliste pour la réalisation du projet.

## Activités réalisées

### Solutions existantes

- **Surdité :** un gant traducteur qui transforme la langue des signes en voix. Un projet réalisé par une startup indienne, publié en mars 2024.  
  [Voir l'article](https://www.lemonde.fr/sciences/article/2024/03/21/un-gant-traducteur-qui-transforme-la-langue-des-signes-en-voix_6223197_1650684.html#:~:text=C'est%20l'objectif%20d,un%20bracelet%20int%C3%A9gr%C3%A9%20au%20gant.)
- **Youth Challenge 2022 :** une équipe de jeunes étudiants algériens a créé un gant capable de transformer la langue des signes en parole.  
  [Voir l'article](https://algeria.un.org/fr/241390-jeunes-innovateurs-cr%C3%A9ent-des-gants-intelligents-pour-donner-voix-%C3%A0-la-langue-des-signes-en)
- **Des gants capables de traduire instantanément le langage des signes.**  
  [Voir l'article](https://ville.montreal.qc.ca/idmtl/des-gants-capables-de-traduire-instantanement-le-langage-des-signes/)

### Limites des solutions existantes

Ces solutions offrent des fonctionnalités similaires à celles de **Harmony Gloves**, mais leur contexte linguistique est limité. En effet, elles prennent en charge la Langue des Signes Anglaise (ASL) ou Française (LSF), mais non la Langue des Signes Camerounaise (LSC). **Harmony Gloves** vise à combler cette lacune, en fournissant un outil pour les Camerounais atteints de déficience auditive ou vocale, afin de briser les barrières communicationnelles et leur offrir une voix dans la société.

## Planification du travail

### Architecture Globale

#### Matériel

**Alternative 1 :**
- 5 Flex sensors : Gant électronique à capteur de courbure de 2,2 pouces.
- Esp 32 / Arduino : Filtrer le signal envoyé par les flex sensors.
- Kit Arduino.
- Paire de gants.

**Alternative 2 :**
- Boutons.
- Esp 32 / carte Arduino : Traiter les signaux envoyés par les boutons.
- Kit Arduino.

#### Croquis

![Alternatives 1 et 2](Figures/ImagesElectro/alt1.jpg)  
![Alternatives 1 et 2](Figures/ImagesElectro/alt2.jpg)

### Planning et Délais

#### Analyse

- **Durée :** 4 semaines.  
- **Période :** Début - 6 Nov.  
- **Objectifs :** Description technique détaillée de la solution et ses différents modules.  
- **Livrable :** Cahier de spécification technique et fonctionnelle.  
- **Tâches majeures :**
  - Recensement du matériel nécessaire.
  - Description de chaque module applicatif/matériel.
  - Entretiens avec la cible de la solution.

#### Conception

- **Durée :** 3 semaines.  
- **Période :** 28 Oct - 18 Nov.  
- **Objectifs :** Réalisation d'un prototype via Proteus.  
- **Livrables :**
  - Prototype monté sur Proteus.
  - Description détaillée du module IA.

#### Implémentation

- **Durée :** 2 semaines.  
- **Période :** 18 Nov - 2 Déc.  
- **Livrables :**
  - MVP de la solution.
  - Documentation du projet.

#### Test, Validation et Corrections

- **Durée :** 1 semaine.  
- **Période :** 2 Déc - 9 Déc.  
- **Livrables :**
  - Solution finale : une main de gant avec l’application.
  - Documentation complète.

### Diagramme de Gantt

![Diagramme de Gantt](Figures/ImagesElectro/gantt.jpg)

### Organisation de l'équipe

| **Poste**                       | **Noms et Prénoms**           | **Description**                                                                 |
|----------------------------------|-------------------------------|---------------------------------------------------------------------------------|
| Chef                             | Kengali Fegue Pacôme          | Coordonne et contrôle l’avancée du projet.                                      |
| Chef Adjoint                     | Hassana Z. Mohamadou          | Assiste dans la coordination et la mise en place du modèle d’IA.                |
| Chargé du Prototypage            | Komguem Ouandi Isis H.        | Réalise le prototype sur Proteus.                                              |
| Chargé de la Documentation       | Maffo Fonkou Natacha B.       | Responsable des documentations et rapports de livrables.                        |
| Chargé du modèle IA              | Mbassi Ewolo Loïc A.          | Responsable de la mise en place du modèle IA.                                   |
| Chargé de l'interface et signal  | Mogou Igor Green              | Responsable des connexions capteurs-Arduino/ESP et du traitement des signaux.   |

### Dépôt GitHub

[https://github.com/PiedPiperJr/harmony-gloves.git](https://github.com/PiedPiperJr/harmony-gloves.git)

## Prochaines étapes

L'équipe va entamer la partie modélisation du projet **Harmony Gloves**.
