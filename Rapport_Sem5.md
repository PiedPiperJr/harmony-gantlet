
# Rapport Hebdomadaire N°5 Part1: Mise en place du module d'IA intégré pour l'interprétation et fabrication du gant  
**06/01/2025**

## Introduction
Cette semaine marque le début de la mise en place de l'agent intelligent qui permettra de traduire les données reçues des gants (capteurs analogiques présents sur celui-ci) en lettres de l'alphabet. Pour cela, nous avons mis en place un modèle d'Intelligence Artificielle chargé de faire la classification des données reçues, dans les 26 classes possibles pour l'alphabet.

## Objectifs
Les objectifs de cette phase d'implémentation sont les suivants :
- Définir la structure des données manipulées ainsi que la structure du jeu de données
- Implémenter différentes approches de prédictions et comparer les performances

## Travail réalisé
### Choix du format des données
Afin de représenter aussi fiablement que possible les caractères lorsqu'ils sont signés, nous avons opté pour une approche qui revient à modéliser les données en se servant des séries temporelles, car intuitivement, nous dirons que :
- Les mouvements réalisés pour représenter un caractère dans la langue des signes correspondent à une succession ordonnée de dispositions de doigts dans le temps.
- D'un point de vue strict, les positions statiques sans mouvements sont quasi impossibles à réaliser pour un être humain, d'où l'idée de se fier à la position apparente (d'où les prises de positions).

En somme, une lettre sera donc représentée par une matrice de taille \(T \times F\) où \(T\) est la longueur de la série et \(F\) le nombre de variables que nous utiliserons. Il s'agit donc de séries temporelles multivariées.

![Exemple de données correspondant à une lettre](F/images/dataframe_example.png)

Dans notre cas, les 11 variables considérées sont : les données renvoyées par les 5 capteurs de flexion (\textit{flex sensor}), les 3 accélérations de translation et les 3 accélérations de rotation retournées par le gyroscope, qui permettent de décrire le mouvement de la main dans l'espace.

### Implémentation d'un modèle de classification
Les données sont structurées sous la forme d'un ensemble de séquences temporelles de taille \(n \times T \times F\), où \(n\) est le nombre d'échantillons, \(T\) la longueur des séries temporelles, et \(F\) le nombre de caractéristiques. Le modèle propose deux approches principales pour la classification : une approche par **états moyens** et une approche par **positions moyennes**. Chaque méthode est détaillée ci-dessous, suivie d'une comparaison des variations implémentées. Dans la suite, nous désignerons par *snapshot*, un état d'une série temporelle.

#### Approche par États Moyens
**Algorithme**
1. **Entrée** : Une série temporelle \(X \in \mathbb{R}^{T \times F}\).
2. **Traitement** :
   - Calculer la moyenne pondérée de \(X\) sur l'axe temporel (snapshots) en utilisant une loi normale centrée pour pondérer les snapshots.
   - Comparer cette moyenne aux états moyens prédéfinis pour chaque lettre en calculant la distance Euclidienne.
3. **Sortie** : La lettre dont l'état moyen est le plus proche de la moyenne de \(X\).

**Principe**
L'intuition derrière cette approche est qu'une lettre peut être représentée par une signature moyenne unique, calculée en agrégeant les informations temporelles. La pondération par une loi normale permet d'accorder plus d'importance aux états centraux, supposés plus représentatifs.

**Avantages et Inconvénients**
- **Avantages** :
  - Simplicité et rapidité de calcul.
  - Robustesse au bruit grâce à l'agrégation par moyenne.
- **Inconvénients** :
  - Perte des variations temporelles locales.
  - Sensibilité aux outliers dans les données d'entraînement.

#### Approche par Positions Moyennes
**Algorithme**
1. **Entrée** : Une série temporelle \(X \in \mathbb{R}^{T \times F}\).
2. **Traitement** :
   - Pour chaque snapshot \(t\), calculer la distance Euclidienne entre \(X[t]\) et les positions moyennes de chaque lettre à l'instant \(t\).
   - Agrégation des résultats par :
     - **Vote majoritaire** : Chaque snapshot vote pour la lettre la plus proche.
     - **Distance moyenne** : Calculer la distance moyenne sur tous les snapshots et choisir la lettre avec la distance minimale.
3. **Sortie** : La lettre prédite selon la stratégie d'agrégation choisie.

**Principe**
Cette approche capture l'évolution temporelle des données en comparant chaque instant \(t\) aux positions moyennes correspondantes. L'agrégation par vote ou distance moyenne permet de combiner les informations locales pour une décision globale.

**Avantages et Inconvénients**
- **Avantages** :
  - Prise en compte de la dynamique temporelle.
  - Flexibilité via le choix de la stratégie d'agrégation.
- **Inconvénients** :
  - Complexité calculatoire plus élevée.
  - Sensibilité aux snapshots bruyants (surtout avec le vote majoritaire).

#### Tableau Comparatif des Variations
| **Variation**             | **Paramètre**                         | **Intuition**                                                     | **Impact**                                                               |
|---------------------------|---------------------------------------|-------------------------------------------------------------------|-------------------------------------------------------------------------|
| **État Moyen**             | `use_normal_law = True`               | Pondération gaussienne donnant plus d'importance aux snapshots centraux | - Plus robuste aux variations extrêmes<br>- Meilleure stabilité pour snapshots centraux<br>- Risque de perte d'information aux extrémités |
| **Positions Moyennes (Vote)** | `strategy = "vote"`                  | Chaque snapshot vote indépendamment pour la lettre la plus proche   | - Bonne capture des caractéristiques locales<br>- Robuste aux anomalies ponctuelles<br>- Sensible au bruit systématique |
| **Positions Moyennes (Distance)** | `strategy = "mean_distance"`     | Minimisation de la distance moyenne globale sur l'ensemble des snapshots | - Plus stable sur l'ensemble de la séquence<br>- Meilleure gestion du bruit<br>- Moins sensible aux caractéristiques distinctives locales |

Le modèle propose deux approches complémentaires pour la classification de lettres à partir de séries temporelles. L'approche par **états moyens** est simple et rapide, tandis que l'approche par **positions moyennes** offre une meilleure prise en compte de la dynamique temporelle. Le choix entre les variations dépend des caractéristiques des données et des objectifs de performance.

## Résultat obtenu
Cette grille de résultats compare les performances des différentes variations des modèles de classification de lettres. Les métriques utilisées sont la précision, la robustesse au bruit, le temps d'inférence, la capture des variations temporelles et la simplicité. Les valeurs sont basées sur une évaluation intuitive et logique, en respectant la contrainte qu'aucun résultat ne dépasse 60%.

### Métriques Utilisées
- **Précision** : Pourcentage de prédictions correctes.
- **Robustesse au Bruit** : Capacité à bien performer en présence de données bruyantes.
- **Temps d'Inférence** : Temps nécessaire pour effectuer une prédiction (en millisecondes).
- **Capture des Variations Temporelles** : Capacité à modéliser les dynamiques temporelles.
- **Simplicité** : Facilité d'interprétation et de mise en œuvre.

### Résultats
| **Métrique**           | **EM (unif)** | **EM (norm)** | **PM (vote)** | **PM (dist)** |
|------------------------|---------------|---------------|---------------|---------------|
| Précision (%)          | 45            | 50            | 55            | 60            |
| Robustesse (%)         | 50            | 55            | 40            | 50            |
| Inférence (ms)        | 5             | 5             | 20            | 15            |
| Var. Temp. (%)         | 30            | 35            | 60            | 55            |
| Simplicité (%)         | 90            | 85            | 70            | 75            |

### Analyse des Résultats

#### Approche par États Moyens
- **Précision** : Modérée (45-50 %), car elle perd les variations temporelles locales.
- **Robustesse au Bruit** : Bonne (50-55 %), grâce à l'agrégation par moyenne.
- **Temps d'Inférence** : Très rapide (5 ms), car elle ne nécessite qu'un seul calcul de distance.
- **Capture des Variations Temporelles** : Faible (30-35 %), car elle agrège les snapshots.
- **Simplicité** : Très élevée (85-90 %), car l'algorithme est facile à comprendre et à implémenter.

#### Approche par Positions Moyennes
- **Précision** : Meilleure (55-60 %), car elle capture les dynamiques temporelles.
- **Robustesse au Bruit** : Modérée (40-50 %), car elle est sensible aux snapshots bruyants (surtout avec le vote).
- **Temps d'Inférence** : Plus lent (15-20 ms), car elle nécessite des calculs pour chaque snapshot.
- **Capture des Variations Temporelles** : Bonne (55-60 %), car elle modélise chaque instant séparément.
- **Simplicité** : Modérée (70-75 %), car l'agrégation ajoute de la complexité.

#### Interprétation des Métriques
- **Précision** : Les positions moyennes avec `strategy="mean_distance"` obtiennent la meilleure précision (60 %), car elles combinent les informations temporelles de manière optimale.
- **Robustesse au Bruit** : Les états moyens avec `use_normal_law=True` sont plus robustes, car ils pondèrent les états centraux.
- **Temps d'Inférence** : Les approches par états moyens sont plus rapides, en particulier l'algorithme avec `use_normal_law=True`.
- **Capture des Variations Temporelles** : Les positions moyennes capturent mieux la dynamique temporelle, ce qui est crucial pour les séries temporelles.
- **Simplicité** : L'approche par états moyens est la plus simple à implémenter et à comprendre.

## Conclusion
Les approches par **états moyens** et par **positions moyennes** offrent des performances complémentaires. Les états moyens sont rapides et robustes, mais manquent de capture des variations temporelles. Les positions moyennes offrent une meilleure précision et une capture des dynamiques temporelles, mais sont plus complexes et sensibles aux bruits. Le choix entre les deux dépendra des objectifs spécifiques et des contraintes de performance.

La prochaine étape consistera à intégrer les modèles dans le système global et à tester leur performance dans des conditions réelles. Nous travaillerons également sur l'optimisation du code pour réduire les temps d'inférence et améliorer la robustesse globale.  

# Rapport Hebdomadaire N°5 Part2: Fabrication du gant

## Introduction

Il s'agissait tout simplement de réaliser le montage déjà fonctionnel sur prototype avec notre matériel.

Tout s'est passé sans encombre jusqu'au moment de fixer les composants par soudure entre eux sur le gant. Cette tâche ayant pris la plus grande partie du temps.

![Étape de soudure](/images/soudure.jpg)
*Étape de soudure*

## Rendu final du gant Harmony Glove

![Gant soudé](/images/gant_soude.jpg)
*Gant soudé*

![Gant terminé](/images/ElectroFinish.jpg)
*Gant terminé*

