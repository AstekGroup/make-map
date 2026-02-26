# Project Vibe Configuration

## Project Type
**POC** (Proof of Concept)

## Project Name
MVP Carte Interactive - Semaine de l'IA pour Tous

## Description
Application React standalone pour afficher 1500 événements sur une carte de France interactive. Le design reprend la charte graphique du site semaine-ia.fr (couleurs, typographie Rubik/Palanquin) tout en proposant une UX moderne et performante.

## Context
- **Client** : La Mednum / Semaine de l'IA pour Tous
- **Event dates** : 18-24 mai 2026
- **Target** : 1500 événements à afficher sur une carte interactive
- **Source site** : https://semaine-ia.fr

## Stack technique
- **Monorepo** : pnpm workspaces + TurboRepo
- **Frontend** : React 18 + Vite
- **Backend** : NestJS 11
- **Map** : MapLibre GL JS + react-map-gl
- **Clustering** : Supercluster
- **Styling** : Tailwind CSS
- **Data source** : API Airtable (via backend proxy)
- **Géocodage** : api-adresse.data.gouv.fr (côté serveur)
- **Types partagés** : @make-map/types

## Requirements
- **DEVPLAN** : Oui (POC)
- **ADR** : Non (POC simple)
- **Documentation** : README.md

## Created
- **Date** : 9 janvier 2026
- **Author** : ILAB Innovation Team
