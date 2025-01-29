# Rapport Hebdomadaire N°2 : Réglage des problèmes sous Proteus  
_18/11/2024_

## Introduction
Au cours des précédents travaux, nous avons constaté que l'Arduino Nano ne permettait pas de transmettre correctement les données analogiques des capteurs flex sous Proteus. Lors des tests de simulation, les valeurs analogiques enregistrées par l'Arduino Nano étaient inexistantes, compromettant ainsi l'ensemble du processus de traitement des signaux. Face à cette limitation, nous avons rencontré Dr. Ngounou Guy qui nous a suggéré de migrer vers l’Arduino Uno d'abord afin de tester le montage. De plus, l'Arduino Uno a été utilisé lors de toutes nos séances pratiques en salle, ce qui facilitera leur manipulation pour le projet. Cette transition a permis la lecture des données de capteurs et une communication fiable entre les différents modules.

## Problèmes rencontrés
Avec l'utilisation de l'Arduino Nano dans Proteus, certains problèmes ont été rencontrés notamment :

### Problème de transmission des données analogiques
Les valeurs des capteurs flex ne transitaient pas du Nano vers le module d'affichage, ce qui entraînait des lectures nulles dans la simulation.

![Afficheur LCD tout au long des tests avec Arduino Nano](/images/AfficheurLCD.PNG)

## Solution Apportée
Pour pallier ce problème, nous avons décidé de :

### Migration vers l'Arduino Uno
Le remplacement de l'Arduino Nano par l'Arduino Uno a permis d'améliorer la lecture des signaux analogiques. L’Uno dispose d'un nombre suffisant de broches analogiques pour gérer efficacement les 5 capteurs flex.

![Test de connectivité avec Arduino Uno](/images/ElectroTestSeparé.PNG)

## Résultat Obtenu
Suite à la mise en œuvre de la solution précédente, des améliorations ont été observées, notamment :

- **Transmission correcte des données analogiques :** les valeurs des capteurs flex sont désormais lues et transmises avec succès.

![Affichage des données analogiques](/images/ElectroTerminal.PNG)

## Prochaines Etapes
Suite à cette transition réussie, la prochaine étape consistera à tester la communication sans fil du dispositif à l’aide du module Bluetooth HC-05.
