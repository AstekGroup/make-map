# DEVPLAN - MVP Carte Interactive

## Objectif
Créer une application React standalone pour afficher 1500 événements de la Semaine de l'IA pour Tous sur une carte interactive performante.

## Étapes de développement

### Phase 1 : Setup et Configuration
- [x] 1.1 Initialisation projet React + Vite
- [x] 1.2 Configuration Tailwind CSS
- [x] 1.3 Installation dépendances MapLibre + react-map-gl
- [x] 1.4 Configuration design system (couleurs, fonts)

### Phase 2 : Carte de base
- [x] 2.1 Intégration MapLibre GL JS
- [x] 2.2 Configuration react-map-gl
- [x] 2.3 Affichage carte de France centrée

### Phase 3 : Clustering
- [x] 3.1 Installation et configuration Supercluster
- [x] 3.2 Génération données mockées (1500 événements)
- [x] 3.3 Affichage clusters sur la carte
- [x] 3.4 Zoom sur cluster au click

### Phase 4 : Interactions
- [x] 4.1 Popup détail événement
- [x] 4.2 Sidebar avec liste événements
- [x] 4.3 Hover preview
- [x] 4.4 Synchronisation carte/liste

### Phase 5 : Filtres
- [x] 5.1 Barre de recherche
- [x] 5.2 Filtre par date
- [x] 5.3 Filtre par région
- [x] 5.4 Filtre par type d'événement

### Phase 6 : UX et Polish
- [x] 6.1 Animations et transitions
- [x] 6.2 Mode responsive (mobile)
- [x] 6.3 Header avec branding (retiré dans Phase 6bis)
- [x] 6.4 Footer avec liens (retiré dans Phase 6bis)

### Phase 6bis : Évolutions UI/UX (Janvier 2026)
- [x] 6b.1 Enrichissement modèle Event (modalité, format, public cible, capacité, etc.)
- [x] 6b.2 Ajout encarts DOM/TOM sur la carte
- [x] 6b.3 Retrait Header et Footer (mode plein écran)
- [x] 6b.4 Réorganisation filtres avec accordéons
- [x] 6b.5 Ajout filtre code postal
- [x] 6b.6 Pictos dans filtre type d'événement
- [x] 6b.7 Amélioration popup événement (style tag, lien détail)
- [x] 6b.8 Responsive amélioré (sidebar mobile)
- [x] 6b.9 Ajout React Router et système de navigation
- [x] 6b.10 Création page d'accueil (carrefour)
- [x] 6b.11 Création page détail événement (style Meetup)
- [x] 6b.12 Création page liste événements en ligne
- [x] 6b.13 Ajout vue liste avec pagination sur la cartographie

### Phase 7 : Intégration API
- [x] 7.1 Connection API Airtable
- [x] 7.2 Transformation données
- [x] 7.3 Gestion erreurs et loading

### Phase 8 : Tests et Déploiement
- [x] 8.1 Tests de performance
- [ ] 8.2 Optimisations
- [ ] 8.3 Build production
- [ ] 8.4 Déploiement

### Phase 9 : Architecture Monorepo (Février 2026)
- [x] 9.1 Setup monorepo TurboRepo + pnpm workspaces
- [x] 9.2 Package partagé @make-map/types
- [x] 9.3 Backend NestJS (apps/backend)
  - [x] Module Airtable (fetch paginé, mapping, transformation)
  - [x] Module Geocoding (api-adresse.data.gouv.fr, cache mémoire serveur)
  - [x] Module Events (REST API, cache TTL 5min)
  - [x] Configuration CORS, @nestjs/config, health check
- [x] 9.4 Nouveau frontend (apps/frontend)
  - [x] API simplifiée (appels HTTP vers le backend)
  - [x] Types partagés via @make-map/types
  - [x] Suppression code Airtable/géocodage côté client
- [x] 9.5 Conservation de map-interactive (version statique inchangée)

### Phase 10 : Déploiement Scaleway (Février 2026)
- [x] 10.1 Dockerfile backend (multi-stage build, port 8080, health check)
- [x] 10.2 Dockerfile frontend (multi-stage build, Nginx SPA fallback, gzip)
- [x] 10.3 Docker Compose production (Caddy + frontend + backend)
- [x] 10.4 Caddy reverse proxy (HTTPS automatique Let's Encrypt)
- [x] 10.5 Adaptation main.ts pour production (CORS configurable, listen 0.0.0.0)
- [x] 10.6 Script de déploiement deploy-v2.sh (rsync + docker compose)
- [x] 10.7 Documentation déploiement (deploy/README.md, .env.prod.example)
- [ ] 10.8 Provisionnement instance Scaleway DEV1-S
- [ ] 10.9 Premier déploiement en production

## Progression
- **Date début** : 9 janvier 2026
- **Statut** : Prêt pour déploiement Scaleway ✅
- **Dernière mise à jour** : 12 février 2026
- **Nouvelles fonctionnalités** : 
  - Monorepo TurboRepo (apps/frontend, apps/backend, apps/map-interactive, shared/types)
  - Backend NestJS : proxy sécurisé pour Airtable (token côté serveur)
  - API REST : GET /api/events, GET /api/events/:id, GET /api/health
  - Géocodage côté serveur avec cache mémoire
  - Cache TTL 5 minutes pour les événements
  - Types partagés entre frontend et backend
  - Version statique (map-interactive) préservée
  - Docker Compose production (Caddy + Nginx + NestJS)
  - HTTPS automatique via Caddy/Let's Encrypt
  - Script de déploiement automatisé (rsync + docker compose)
  - Cible : instance Scaleway DEV1-S (~11 EUR/mois, 24/7)
- **Prochaine étape** : Provisionner l'instance Scaleway et déployer
