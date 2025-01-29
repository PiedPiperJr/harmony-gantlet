\chapter{Rapport Hebdomadaire N°7 :Test de fonctionnement de Harmony Gloves \\27/01/2025}


\section{Introduction}
Au terme de la réalisation du projet Harmony Gloves, on a procédé à une série de tests pour s'assurer de l'efficacité de l'outil. On a utilisé diverses approches pour évaluer l'état de chaque fonctionnalité initialement prévue

\section{Objectifs}

L'objectif principal de cette semaine était de valider le fonctionnement des fonctionnalités implémentées lors des phases de développement à travers des tests rigoureux, d’identifier les éventuels bogues ou limitations, et de préparer la transition vers l'étape finale de déploiement.

\section{Activités réalisées}

\subsection*{a) Préparation de l'environnement de test}
\begin{itemize}
    \item Mise en place des scénarios de test basés sur les spécifications fonctionnelles.
    \item Configuration de l'environnement local et des appareils nécessaires (simulateurs Bluetooth, gants connectés, appareils mobiles, etc.).
\end{itemize}

\subsection*{b) Tests unitaires}
\begin{itemize}
    \item Couverture des principales fonctionnalités, incluant :
    \begin{itemize}
        \item Appairage Bluetooth avec différents appareils.
        \item Traduction des gestes en texte (précision et rapidité).
        \item Gestion des erreurs (connexion perdue, appareil non détecté, etc.).
    \end{itemize}
\end{itemize}

\subsection*{c) Tests d'intégration}
\begin{itemize}
    \item Validation des interactions entre les différents modules :
    \begin{itemize}
        \item Interaction entre l'interface utilisateur et le backend.
        \item Traitement en temps réel des données transmises par les capteurs Bluetooth.
    \end{itemize}
\end{itemize}

\subsection*{d) Tests utilisateurs} 
\begin{itemize}
    \item Séances de tests avec un échantillon d’utilisateurs pour évaluer :
    \begin{itemize}
        \item L’intuitivité de l’interface utilisateur.
        \item La fiabilité et la fluidité de l’expérience globale.
    \end{itemize}
\end{itemize}

\section{Résultats obtenus}

\subsection*{Succès}
\begin{itemize}
    \item Appairage réussi avec 90\% des appareils Bluetooth testés.
    \item Traduction précise des gestes avec un taux de précision de 60 \%.
    \item Interface utilisateur bien accueillie par les utilisateurs testeurs, jugée intuitive et facile à utiliser.
\end{itemize}

\subsection*{Problèmes identifiés}
\begin{itemize}
    \item \textbf{Incompatibilité avec certains appareils Bluetooth :} Les appareils utilisant d'anciennes versions de Bluetooth (avant 4.0) ne sont pas pris en charge. Une solution serait de spécifier les appareils compatibles dans la documentation utilisateur.
    \item \textbf{Latence dans la traduction des gestes :} Une légère latence (environ 1 seconde) a été constatée lors de la traduction des gestes en texte. Une optimisation du traitement des données au niveau du backend est prévue.
    \item \textbf{Bogue d’affichage sur certains navigateurs :} Des problèmes d'affichage sur Safari et Edge nécessitent une investigation supplémentaire.(Cause surement due à l'API Web-Bluetooth non supportée par tous les navigateurs)
\end{itemize}

\section{Prochaines étapes}
\begin{itemize}
    \item \textbf{Correction des bogues identifiés :} Résoudre les incompatibilités Bluetooth et optimiser la gestion des données en temps réel. Corriger les problèmes d’affichage sur les navigateurs identifiés.
    \item \textbf{Tests de performance et robustesse :} Effectuer des tests de charge pour évaluer la performance de l’application sous des conditions d’utilisation intense.
    \item \textbf{Préparation du déploiement :} Finaliser la documentation technique et utilisateur. Mettre en place un environnement de production stable.
\end{itemize}

\section{Remarques finales}
La phase de test a permis de valider une grande partie des fonctionnalités tout en identifiant des améliorations nécessaires. Les résultats obtenus sont encourageants, et l’équipe reste confiante pour le lancement prévu dans les délais impartis.

\section{Déploiement}
Le projet correct aurait d'être déployé sur vercel, mais en raison de quelques soucis techniques, cela n'a pas pu se faire.
