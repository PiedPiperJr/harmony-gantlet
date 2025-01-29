# Rapport Semaine N°3 : Test de connectivité Bluetooth  
_09/12/2024_

## Introduction
Cette semaine a été consacrée à l’intégration du module Bluetooth HC-06, qui est utilisé pour assurer la transmission des données des capteurs de Harmony Gloves vers un appareil externe. L'objectif principal était de vérifier la fiabilité et la fluidité de la communication sans fil afin d'assurer un transfert précis des données interprétées. La mise en œuvre de la connectivité Bluetooth est essentielle pour permettre à l’utilisateur de visualiser en temps réel les gestes interprétés via l’application mobile. Cela implique de garantir une liaison stable et sans interruption entre l’Arduino Uno et le smartphone, même en mouvement.

## Objectifs
Parmi les objectifs de la phase de test de connectivité Bluetooth, on distingue :

- S'assurer de l'envoi des signaux depuis le module Bluetooth HC-06.
- Récupérer et interpréter les différents signaux reçus depuis le terminal.

## Description du module Bluetooth

### Module Bluetooth HC-06
Le **HC-06** est un module Bluetooth utilisé pour établir une communication série sans fil entre deux dispositifs. Il est principalement utilisé dans les projets Arduino et autres microcontrôleurs. Ce module fonctionne selon le standard Bluetooth 2.0 et est compatible avec les interfaces UART.

- **Caractéristiques principales :**
  - Tension de fonctionnement : 3,3V à 5V.
  - Communication série UART (Rx, Tx).
  - Baudrate par défaut : 9600 bps (configurable).
  - Distance maximale : environ 10 mètres en espace ouvert.
  - Facilité d'utilisation avec une simple configuration maître/esclave.

- **Applications courantes :**
  - Contrôle de robots via smartphone.
  - Échange de données sans fil.
  - Intégration dans des systèmes IoT.

![Prototype avec Connexion Bluetooth](Figures/ImagesElectro/ElectroProteus2.PNG)

![Prototype avec Gyroscope](Figures/ImagesElectro/gyr.jpg)

## Insertion du module dans le montage et difficultés rencontrées
Une fois le montage réalisé en accord avec la modélisation, après alimentation du microprocesseur, on observe l'ensemble des services envoyés par le module depuis l'API de **web-bluetooth**, d'une part, et via un code de test en Python, d'autre part.

## Difficultés rencontrées
La visibilité du module Bluetooth depuis le navigateur nécessitait une configuration préalable de celui-ci, à savoir l'activation des flags *web-bluetooth* et *experimental-JavaScript*.

## Étapes suivantes
Réaliser l'application mobile.
