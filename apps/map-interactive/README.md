# Carte Interactive - Semaine de l'IA pour Tous

Application React standalone pour afficher les événements de la Semaine de l'IA pour Tous sur une carte interactive de France.

## Aperçu

Cette application permet de visualiser et filtrer 1500 événements de sensibilisation à l'intelligence artificielle organisés sur tout le territoire français.

### Fonctionnalités

- 🗺️ **Carte interactive** avec MapLibre GL JS (WebGL)
- 📍 **Clustering intelligent** avec Supercluster (gère 500k+ points)
- 🔍 **Recherche** par ville, organisateur, région
- 📅 **Filtres** par date (pendant/hors Semaine IA), type d'événement, région
- 📱 **Responsive** (desktop + mobile)
- 🎨 **Design** respectant la charte graphique semaine-ia.fr

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React 18 + Vite | Framework et bundler |
| MapLibre GL JS | Carte vectorielle WebGL |
| react-map-gl | Wrapper React pour MapLibre |
| Supercluster | Clustering performant |
| Tailwind CSS | Styling |
| Lucide React | Icônes |

## Installation

```bash
# Installer les dépendances
pnpm install

# Lancer en mode développement
pnpm dev

# Build production
pnpm build
```

## Structure du projet

```
src/
├── components/
│   ├── Map/           # Composants carte (MapView, Markers, Popup)
│   ├── Sidebar/       # Sidebar avec liste et recherche
│   ├── Filters/       # Panneau de filtres
│   ├── Layout/        # Header et Footer
│   └── UI/            # Composants UI réutilisables
├── hooks/
│   ├── useEvents.ts   # Gestion des événements et filtres
│   ├── useClusters.ts # Clustering avec Supercluster
│   └── useMapViewport.ts
├── data/
│   └── mockEvents.ts  # Données mockées (1500 événements)
├── types/
│   └── event.ts       # Types TypeScript
└── styles/
    └── globals.css    # Styles globaux + Tailwind
```

## Design System

Couleurs reprises de semaine-ia.fr :

| Couleur | Hex | Usage |
|---------|-----|-------|
| Bleu foncé | `#003081` | Fond principal, header |
| Rose coral | `#f56476` | Boutons, clusters, accents |
| Magenta | `#cc3366` | Liens, hover |
| Beige | `#ffeed1` | Fond secondaire |

Typographie :
- **Titres** : Rubik (Google Fonts)
- **Corps** : Palanquin (Google Fonts)

## Configuration API

Pour connecter l'API Airtable, modifier le fichier `src/services/api.ts` :

```typescript
const AIRTABLE_API_KEY = 'votre_cle_api';
const AIRTABLE_BASE_ID = 'votre_base_id';
```

## Scripts disponibles

```bash
pnpm dev      # Serveur de développement (localhost:5173)
pnpm build    # Build production
pnpm preview  # Preview du build
pnpm lint     # Lint du code
```

## Performance

L'application est optimisée pour gérer un grand nombre d'événements :

- **Clustering WebGL** : Les événements sont groupés automatiquement selon le niveau de zoom
- **Virtualisation** : Seuls les événements visibles sont rendus
- **Lazy loading** : Chargement progressif des données
- **Memoization** : Cache des calculs de clusters

## Liens

- Site principal : https://semaine-ia.fr
- Documentation API : À compléter
- LinkedIn La Mednum : https://www.linkedin.com/company/mednum/

---

**Semaine de l'IA pour Tous** - Du 18 au 24 mai 2026  
Organisé par [La Mednum](https://lamednum.coop)
