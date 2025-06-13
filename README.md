
# Projet S4 - Gestionnaire de Stock

## Description

Ce projet est un gestionnaire de stock moderne developpe dans le cadre de la SAE - Projet-S4-DACS-01-2-Deploiement avance.
Il propose une interface web ergonomique et securisee permettant de :

- Gerer les utilisateurs et leurs roles
- Visualiser, ajouter, modifier et supprimer des produits
- Consulter l'historique des mouvements de stock
- Gerer les droits d'acces via authentification JWT
- Disposer d'une API REST claire et structuree
- Offrir une experience fluide grace a une SPA React

Le projet est conteneurise (Docker Compose) et deploye en ligne sur un VPS.

Demo en ligne : https://firevaam.com

## Architecture technique

Le projet repose sur une architecture micro-services simple :

- Frontend : React + Nginx (Interface utilisateur)
- Backend : Node.js + Express (API REST securisee)
- Base de donnees : MongoDB (Stockage des donnees)
- Reverse Proxy + TLS : Nginx + Certbot (HTTPS securise)

## Fonctionnalites principales

- Authentification JWT
- Gestion des roles (user / admin)
- CRUD produits
- Suivi des mouvements de stock
- Interface responsive
- Deploiement HTTPS
- Configuration securisee (certificats non commites, .env ignores)

## Prerequis

- Git
- Docker
- Docker Compose
- Node.js (pour developpement local)

## Installation locale

git clone https://github.com/eniotnA57/Projet-S4-DACS-01-2-Deploiement-avance.git
cd Projet-S4-DACS-01-2-Deploiement-avance
docker compose up -d --build

Le projet sera disponible sur :

- Frontend : http://localhost
- Backend API : http://localhost:8000/api/
- MongoDB : localhost:27017

## Deploiement en production

Le projet est deploye sur un VPS (Hetzner) avec la stack suivante :

- Docker Compose
- Nginx en reverse proxy
- Certbot pour HTTPS

Pipeline deploiement manuel :

git pull origin main

docker compose down

docker compose up -d --build

## Bonnes pratiques

- Tous les services s'executent via Docker Compose
- Aucun fichier sensible commit (certificats, .env)
- Nginx configure avec redirection HTTPS forcee
- Ports explicitement definis
- Secrets geres via variables d'environnement

## Pipeline CI/CD

Un pipeline CI/CD simple est en place via GitHub Actions.

Le pipeline permet d'automatiser :

- Le build de l'application
- La verification du projet
- La preparation au deploiement

Le deploiement en production reste semi-automatise (git pull + docker compose up -d --build), mais le pipeline garantit l'integrite du code a chaque push.

## Fonctionnalite supplementaire (Bonus)

- Gestion fine des roles avec passage d'un utilisateur en admin dynamique
- API securisee avec JWT
- Interface en HTTPS avec Let's Encrypt integree au build

## Auteurs

- Antoine Velamena - eniotnA57
- Alois MASSON--CLAUDEZ - Packingdustry

## Notes finales

Le projet respecte l'ensemble des criteres du cahier des charges :

- Fonctionnel de bout en bout
- Structure de code propre et maintenable
- Conteneurisation complete via Docker Compose
- Deploiement en ligne reussi et securise
- Bonnes pratiques de securite appliquees
- Documentation claire et complete
- Autonomie, rigueur technique, initiative demontrees

