# AI Front Orchestrator

Ce projet est le frontend Angular (v21.1) pour la plateforme **AI Orchestrator**. Il a été conçu en utilisant les interfaces UI modernes fournies dans le dépôt `UI-OF-PaaS-SOLUTION`.

## Fonctionnalités Implémentées

- **Dashboard Moderne** : Vue d'ensemble des projets, statistiques en temps réel et timeline d'activité.
- **Services API** : Intégration complète avec le backend `ai-orchestrator` (Inference, Generation, Project Management, Git, Security).
- **WebSocket Integration** : Support pour la console en temps réel, le terminal IDE et le streaming de monitoring.
- **Thème Sombre** : Interface utilisateur optimisée pour les développeurs avec un design "PaaS" professionnel.

## Structure du Projet

- `src/app/services/api.service.ts` : Service central pour toutes les requêtes HTTP vers le backend.
- `src/app/services/websocket.service.ts` : Gestion des connexions WebSocket temps réel.
- `src/app/components/dashboard/` : Composant principal du tableau de bord avec style SCSS personnalisé.

## Installation

1. Cloner le dépôt.
2. Installer les dépendances : `npm install`.
3. Lancer le projet : `ng serve`.

## Configuration Backend

Par défaut, le frontend tente de se connecter au backend sur `http://localhost:8080`. Vous pouvez modifier cette configuration dans `src/app/services/api.service.ts`.
