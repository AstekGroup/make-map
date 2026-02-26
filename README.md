# Make Map - Semaine de l'IA pour Tous

Carte interactive pour visualiser les 1500+ événements de la [Semaine de l'IA pour Tous](https://semaine-ia.fr) (18-24 mai 2026) à travers la France.

**Client** : La Mednum | **Stack** : React + NestJS + MapLibre GL JS | **Monorepo** : pnpm + TurboRepo

## Structure du projet

```
make-map/
├── apps/
│   ├── frontend/           # React + Vite (consomme l'API backend)
│   ├── backend/            # NestJS (proxy Airtable + géocodage)
│   └── map-interactive/    # Version standalone originale (référence)
├── shared/
│   └── types/              # @make-map/types (types TypeScript partagés)
├── deploy/                 # Docker Compose + Caddy (production)
├── scripts/                # Scripts de déploiement
├── resources/              # Analyses et design system de référence
├── turbo.json
└── pnpm-workspace.yaml
```

## Démarrage rapide

### Prérequis

- Node.js 18+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Variables d'environnement

Copier les fichiers `.env.example` et renseigner les valeurs :

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

| Variable | Où | Description |
|---|---|---|
| `AIRTABLE_API_KEY` | backend | Personal Access Token Airtable |
| `AIRTABLE_BASE_ID` | backend | ID de la base (commence par `app`) |
| `AIRTABLE_TABLE_ID` | backend | ID de la table (commence par `tbl`) |
| `VITE_API_URL` | frontend | URL du backend (`http://localhost:3000`) |
| `VITE_MAPTILER_KEY` | frontend | Clé API MapTiler ([obtenir ici](https://cloud.maptiler.com/account/keys/)) |

### Lancer le projet

```bash
# Frontend + backend ensemble
pnpm dev

# Ou séparément
pnpm back:dev    # Backend (port 3000)
pnpm front:dev   # Frontend (port 5173)
```

## Applications

### Backend (`apps/backend`)

Proxy sécurisé NestJS pour l'API Airtable. Le token reste côté serveur.

- **API** : `GET /api/events` · `GET /api/events/:id` · `GET /api/health`
- Géocodage via [api-adresse.data.gouv.fr](https://adresse.data.gouv.fr) avec cache permanent
- Cache TTL 5 min pour les données Airtable
- `?devMode=true` pour bypasser le filtre de modération

### Frontend (`apps/frontend`)

Application React avec carte interactive MapLibre GL JS.

- Clustering (Supercluster) pour 1500+ événements
- Filtres par type, format, audience, modalité, région
- Vue carte + vue liste avec pagination
- Encarts DOM-TOM
- Design system calé sur la charte semaine-ia.fr (Rubik / Palanquin)

### map-interactive (`apps/map-interactive`)

Version standalone originale avec appel direct Airtable côté client. Conservée comme référence, non modifiée.

```bash
pnpm map:dev
```

## Package partagé

### @make-map/types (`shared/types`)

Types TypeScript partagés : `Event`, `EventType`, `EventFormat`, `TargetAudience`, `EventModality`, `GeoJSONEvent`, constantes de labels, liste des régions.

## Déploiement

Instance **Scaleway DEV1-S** avec Docker Compose : Caddy (HTTPS auto) + Nginx (frontend) + NestJS (backend).

```bash
pnpm deploy:v2
```

Voir [deploy/README.md](deploy/README.md) pour le guide complet.

## Ressources

- [Analyse du site semaine-ia.fr](resources/analyse-semaine-ia-fr.md)
- [Analyse des frameworks carte](resources/analyse-frameworks-carte-interactive.md)

## Liens

- Site officiel : https://semaine-ia.fr
- Organisateur : [La Mednum](https://lamednum.coop)

---

**POC - Astek Innovation Lab**
