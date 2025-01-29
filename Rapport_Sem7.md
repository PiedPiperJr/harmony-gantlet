# Rapport Hebdomadaire N°7 Partie 1: Implémentation du modèle LSTM pour la classification des lettres (13/01/2025)

## Introduction

Cette semaine, nous avons implémenté un modèle de classification basé sur des réseaux de neurones récurrents de type LSTM (Long Short-Term Memory) pour interpréter les données temporelles issues des capteurs du gant. L'objectif est de classer les séquences de données en 26 classes correspondant aux lettres de l'alphabet. Ce modèle vise à améliorer la précision de classification en capturant les dépendances temporelles complexes présentes dans les données.

## Objectifs

Les objectifs de cette phase d'implémentation sont les suivants :

- Implémenter un modèle LSTM pour la classification des séquences temporelles.
- Comparer les performances du modèle LSTM avec les approches précédentes (états moyens et positions moyennes).
- Évaluer la robustesse et la précision du modèle sur des données synthétiques et réelles.

## Travail réalisé

### Choix du modèle LSTM

Les réseaux LSTM sont particulièrement adaptés pour les séquences temporelles, car ils peuvent retenir des informations sur de longues périodes et capturer des dépendances complexes entre les pas de temps. Pour notre problème de classification, nous avons choisi une architecture LSTM suivie de couches denses pour effectuer la prédiction finale.

### Architecture du modèle

Le modèle proposé est structuré comme suit :

- **Couche LSTM** : Une première couche LSTM avec 64 unités, configurée pour retourner des séquences complètes (`return_sequences=True`).
- **Couche LSTM** : Une deuxième couche LSTM avec 32 unités, retournant uniquement le dernier état caché.
- **Couche Dense** : Une couche dense avec 64 unités et une fonction d'activation ReLU.
- **Dropout** : Une couche de dropout avec un taux de 0.3 pour réduire le surapprentissage.
- **Couche Dense** : Une couche dense avec 32 unités et une fonction d'activation ReLU.
- **Dropout** : Une couche de dropout avec un taux de 0.2.
- **Couche de Sortie** : Une couche dense avec 26 unités (une par lettre) et une fonction d'activation softmax pour la classification multi-classes.

### Entraînement du modèle

Le modèle est entraîné en utilisant les données synthétiques générées précédemment. Les étapes clés de l'entraînement sont les suivantes :

- **Prétraitement des données** : Les données sont normalisées pour améliorer la convergence du modèle.
- **Découpage des données** : Les données sont divisées en ensembles d'entraînement (80%) et de test (20%).
- **Compilation du modèle** : Le modèle est compilé avec l'optimiseur Adam, une fonction de perte `categorical_crossentropy` et la métrique d'accuracy.
- **Entraînement** : Le modèle est entraîné sur 50 epochs avec un batch size de 32 et une validation sur 20% des données d'entraînement.

### Évaluation du modèle

Le modèle est évalué sur l'ensemble de test pour mesurer sa précision et sa robustesse. Les résultats sont comparés avec les approches précédentes (états moyens et positions moyennes).

## Résultats obtenus

### Performances du modèle LSTM

| **Métrique**                      | **Valeur** |
|------------------------------------|-----------|
| Précision (%)                     | 85        |
| Robustesse au Bruit (%)            | 80        |
| Temps d'Inférence (ms)             | 50        |
| Capture des Variations Temporelles (%) | 90  |
| Simplicité (%)                     | 60        |

### Analyse des résultats

- **Précision** : Le modèle LSTM atteint une précision de 85%, surpassant les approches précédentes grâce à sa capacité à capturer les dépendances temporelles complexes.
- **Robustesse au Bruit** : Avec une robustesse de 80%, le modèle LSTM est moins sensible au bruit que les approches par positions moyennes, mais légèrement moins robuste que les états moyens.
- **Temps d'Inférence** : Le temps d'inférence est de 50 ms, ce qui est plus lent que les approches précédentes en raison de la complexité du modèle.
- **Capture des Variations Temporelles** : Le modèle LSTM capture 90% des variations temporelles, ce qui en fait la meilleure approche pour modéliser les dynamiques temporelles.
- **Simplicité** : Avec un score de simplicité de 60%, le modèle LSTM est plus complexe à comprendre et à implémenter que les approches précédentes.

### Comparaison avec les approches précédentes

| **Métrique** | **EM (unif)** | **EM (norm)** | **PM (vote)** | **PM (dist)** | **LSTM** |
|-------------|--------------|--------------|--------------|--------------|--------|
| Précision (%) | 45           | 50           | 55           | 60           | 85     |
| Robustesse (%) | 50           | 55           | 40           | 50           | 80     |
| Inférence (ms) | 5            | 5            | 20           | 15           | 50     |
| Var. Temp. (%) | 30           | 35           | 60           | 55           | 90     |
| Simplicité (%) | 90           | 85           | 70           | 75           | 60     |

## Conclusion

- Le modèle LSTM offre la meilleure précision (85%) et capture 90% des variations temporelles, ce qui en fait l'approche la plus performante pour notre problème de classification.
- Cependant, il est plus complexe à implémenter et a un temps d'inférence plus long (50 ms) que les approches précédentes.
- Pour des applications nécessitant une haute précision et une bonne capture des dynamiques temporelles, le modèle LSTM est recommandé. Pour des applications nécessitant rapidité et simplicité, les approches par états moyens restent une option viable.

---

# Rapport Hebdomadaire N°7 : Partie 2 Test de fonctionnement de Harmony Gloves (27/01/2025)

## Introduction

Au terme de la réalisation du projet Harmony Gloves, une série de tests a été menée pour s'assurer de l'efficacité de l'outil. Diverses approches ont été utilisées pour évaluer l'état de chaque fonctionnalité initialement prévue.

## Objectifs

L'objectif principal de cette semaine était de valider le fonctionnement des fonctionnalités implémentées lors des phases de développement à travers des tests rigoureux, d’identifier les éventuels bogues ou limitations, et de préparer la transition vers l'étape finale de déploiement.

## Activités réalisées

### a) Préparation de l'environnement de test

- Mise en place des scénarios de test basés sur les spécifications fonctionnelles.
- Configuration de l'environnement local et des appareils nécessaires (simulateurs Bluetooth, gants connectés, appareils mobiles, etc.).

### b) Tests unitaires

- Appairage Bluetooth avec différents appareils.
- Traduction des gestes en texte (précision et rapidité).
- Gestion des erreurs (connexion perdue, appareil non détecté, etc.).

### c) Tests d'intégration

- Validation des interactions entre les différents modules :
  - Interaction entre l'interface utilisateur et le backend.
  - Traitement en temps réel des données transmises par les capteurs Bluetooth.

### d) Tests utilisateurs

- Évaluation de l’intuitivité de l’interface utilisateur.
- Vérification de la fiabilité et fluidité de l’expérience globale.

## Résultats obtenus

**Succès :**
- Appairage réussi avec 90% des appareils Bluetooth testés.
- Traduction précise des gestes avec un taux de précision de 60%.
- Interface utilisateur intuitive et bien accueillie.

**Problèmes identifiés :**
- Incompatibilité avec certains appareils Bluetooth anciens.
- Légère latence (~1s) dans la traduction des gestes.
- Problèmes d'affichage sur Safari et Edge (API Web-Bluetooth non supportée).

## Prochaines étapes

- Correction des bogues identifiés.
- Tests de performance et robustesse.
- Préparation du déploiement.

## Déploiement

Le projet devait être déployé sur Vercel, mais des problèmes techniques ont empêché cette étape.
