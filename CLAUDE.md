# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MVP POC for "Semaine de l'IA pour Tous" - an interactive map application displaying 1500+ AI awareness events across France. The project is a standalone React app with advanced clustering and filtering capabilities.

**Client**: La Mednum / Semaine de l'IA pour Tous
**Event dates**: May 18-24, 2026
**Status**: MVP functional, ready for Airtable API integration

## Commands

Commands can be run from the **root directory** (recommended) or from `apps/map-interactive`:

```bash
# From root (recommended)
pnpm run install:map  # Install dependencies
pnpm dev             # Start dev server (localhost:5173)
pnpm build           # TypeScript compile + Vite build
pnpm preview         # Preview production build
pnpm lint            # ESLint check

# Or from apps/map-interactive
cd apps/map-interactive
pnpm install && pnpm dev
```

## Architecture Overview

### Application Structure

The app follows a **hook-first architecture** where custom hooks manage state and business logic, while components focus on presentation:

```
App.tsx (root)
├── useEvents hook           # Central state management
│   ├── Event loading/filtering
│   ├── Filter state (search, date, region, type)
│   └── Statistics computation
├── MapView component
│   └── useClusters hook     # Supercluster integration
│       ├── Cluster computation
│       └── Map feature rendering
└── Sidebar component
    └── Event list & filters
```

### Key Custom Hooks

**`useEvents`** (`src/hooks/useEvents.ts`)
- Central state management for the entire app
- Loads events (currently mocked, ready for API)
- Manages all filter state (search, date, regions, types)
- Computes filtered events and statistics
- Returns events as both array and GeoJSON

**`useClusters`** (`src/hooks/useClusters.ts`)
- Wraps Supercluster library for performance
- Takes GeoJSON, bounds, and zoom level
- Returns clusters for current viewport
- Provides cluster expansion and child retrieval
- Memoized for optimal performance

**`useMapViewport`** (`src/hooks/useMapViewport.ts`)
- Manages map viewport state (zoom, center, bounds)
- Syncs with react-map-gl

### Data Flow

1. **useEvents** loads/filters events → outputs GeoJSON
2. **MapView** receives GeoJSON → passes to **useClusters**
3. **useClusters** + viewport → computes visible clusters/points
4. Markers render clusters (ClusterMarker) or events (EventMarker)
5. User interaction (click/hover) → updates App state → syncs sidebar

### Component Organization

- `components/Map/` - MapLibre integration (MapView, markers, popup)
- `components/Sidebar/` - Event list, search, filter UI
- `components/Filters/` - Filter panel (date, region, type)
- `components/Layout/` - Header and Footer
- `components/UI/` - Reusable UI components (Button, Badge)

### Type System

All types defined in `src/types/event.ts`:
- `Event` - Core event model
- `EventType` - Event categories (cafe-ia, atelier, conference, jeu, autre)
- `GeoJSONEvent`, `EventsGeoJSON` - GeoJSON representations
- `ClusterFeature`, `EventFeature`, `MapFeature` - Supercluster types
- Type guards: `isCluster(feature)` to distinguish clusters from points

## Design System

The app uses a custom design system matching semaine-ia.fr branding, configured in `tailwind.config.ts`:

**Colors** (semantic tokens):
- `primary` (#003081) - Main brand blue, headers, text
- `accent-coral` (#f56476) - CTAs, clusters, highlights
- `accent-magenta` (#cc3366) - Links, hover states
- `surface-beige` (#ffeed1) - Background

**Typography**:
- Titles: `font-rubik` (Rubik from Google Fonts)
- Body: `font-palanquin` (Palanquin from Google Fonts)

**Conventions**:
- Use semantic color classes: `bg-primary`, `text-accent-coral`
- Custom animations available: `animate-fade-in`, `animate-slide-up`, `animate-scale-in`
- Shadow utilities: `shadow-card`, `shadow-popup`, `shadow-cluster`

## Path Aliases

TypeScript and Vite configured with `@/` alias pointing to `src/`:

```typescript
import { useEvents } from '@/hooks';
import { Event } from '@/types/event';
```

## API Integration (Future)

The app is ready for Airtable API integration:

1. Set environment variables in `.env`:
   ```
   VITE_AIRTABLE_API_KEY=your_key
   VITE_AIRTABLE_BASE_ID=your_base_id
   ```

2. `src/services/api.ts` handles API calls with automatic fallback to mock data

3. Expected Airtable field mapping defined in `AirtableRecord` interface

4. Update `useEvents` hook to call `fetchEvents()` from API service instead of importing `MOCK_EVENTS`

## Performance Considerations

- **Clustering**: Supercluster handles 500k+ points efficiently
- **Memoization**: Heavy computations (filtering, GeoJSON conversion, clustering) are memoized
- **Viewport culling**: Only render visible clusters/events
- **WebGL rendering**: MapLibre uses GPU acceleration
- When adding features, ensure computed values use `useMemo` and callbacks use `useCallback`

## Important Notes

- This is a POC/MVP - focus on functionality over perfection
- Mock data in `src/data/mockEvents.ts` contains 1500 generated events
- The app is responsive (desktop + mobile) with conditional UI
- All French text/labels should remain in French
- Event dates reference May 2026 event week
