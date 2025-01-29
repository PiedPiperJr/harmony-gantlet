# Rapport Hebdomadaire N°6 : Retour vers une application web et implications  
_13/01/2025_

## Introduction
La création de l'application mobile ayant été réalisée, nous nous sommes butés à un problème de déploiement nécessitant un compte Google Developers. Malheureusement, les moyens financiers pour souscrire à celui-ci faisaient défaut. Dans l’optique d’aboutir à un produit fini et déployé, nous avons réorienté la conception de l’application vers une **application web progressive**.

## Objectif
Faire un refactoring de l'application mobile préalablement conçue afin de conserver son design et ses fonctionnalités, tout en la rendant accessible aux utilisateurs depuis le web après déploiement.

## Activités réalisées

### Création d'un projet Next.js
L'application **Harmony Gloves**, conçue pour visualiser la traduction de la langue des signes en texte, nécessite un framework performant et flexible. Le choix de **Next.js** s'explique par les avantages suivants, spécifiques à ce projet :

- **Rendu en temps réel grâce au Server-Side Rendering (SSR) :**  
  Pour une application comme Harmony Gloves, où les données doivent être affichées instantanément après traitement, le SSR garantit une faible latence et une expérience utilisateur fluide.

- **Intégration simplifiée avec des modèles IA via des APIs :**  
  L'application repose sur un modèle d'intelligence artificielle pour analyser les signaux des capteurs. Next.js permet de créer facilement des API intégrées, assurant une communication rapide et fiable entre l'ESP/Arduino, le modèle IA et l'application web.

- **Gestion efficace des données dynamiques :**  
  La visualisation des traductions nécessite l'affichage de données dynamiques, telles que le texte traduit et les statistiques sur les gestes reconnus. Grâce à la génération de contenu dynamique (SSR et SSG), Next.js gère ces données avec des performances optimisées.

- **Support des visualisations interactives :**  
  Harmony Gloves prévoit des visualisations des gestes et des traductions. Avec l'écosystème riche de React et des bibliothèques compatibles, comme D3.js ou Chart.js, Next.js facilite l'ajout de graphiques, animations ou interfaces interactives.

- **Optimisation des performances sur appareils mobiles :**  
  L'application étant destinée à un large public, y compris les utilisateurs mobiles, Next.js garantit une performance optimale grâce à son système de gestion de ressources, de préchargement des pages, et de réduction des temps de chargement.

- **Déploiement rapide et maintenance facile :**  
  Avec Next.js, l'application peut être déployée facilement sur des plateformes comme Vercel, offrant un support natif pour les mises à jour continues et les optimisations automatiques.

En résumé, **Next.js** répond parfaitement aux exigences de rapidité, de gestion des données dynamiques et de visualisation interactive d’Harmony Gloves, tout en offrant une expérience utilisateur optimale.

## Résultat obtenu
![Vue menu version web](Figures/ImagesElectro/screenmenu.jpg)  
_Figure 1 : Vue menu version web_

![Vue sidebar version web](Figures/ImagesElectro/screensidebar.jpg)  
_Figure 2 : Vue sidebar version web_

![Vue photo version web](Figures/ImagesElectro/screephoto.jpg)  
_Figure 3 : Vue photo version web_

![Vue paramètres version web](Figures/ImagesElectro/screensettings.jpg)  
_Figure 4 : Vue paramètres version web_

## Prochaines étapes
- Finaliser l’intégration des fonctionnalités Bluetooth avec la PWA.
- Déployer l’application web sur une plateforme accessible au grand public.
