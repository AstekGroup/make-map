# AGENTS.md — `@make-map/frontend`

[← Instructions racine](../../AGENTS.md) · [Backend](../backend/AGENTS.md) · [Types](../../shared/types/AGENTS.md) · [CLAUDE.md](../../CLAUDE.md)

## Contexte

Application **React 18 + Vite** : carte MapLibre, clustering Supercluster, appels HTTP vers le **backend uniquement** (pas d’Airtable client ici).

## Commandes (depuis `apps/frontend`)

```bash
pnpm dev          # Vite — http://localhost:5173
pnpm build
pnpm lint
pnpm test         # Vitest
```

Depuis la racine du monorepo : `pnpm front:dev`.

## Conventions

- Alias **`@/`** → `src/`.
- Types métier : `@/types/event` (réexport) ou `@make-map/types`.
- **Français** pour l’UI.
- Performance : `useMemo` / `useCallback` pour carte et listes ; voir hooks `useEvents`, `useClusters`.

## Zones utiles

| Dossier | Rôle |
|---------|------|
| `src/components/Map/` | Carte, marqueurs, popup |
| `src/components/Sidebar/` | Liste latérale |
| `src/components/Filters/` | Panneau filtres |
| `src/hooks/` | `useEvents`, `useClusters`, viewport |
| `src/pages/` | Routes (`MapPage`, `EventsListPage`, etc.) |
| `src/services/api.ts` | Client HTTP vers `VITE_API_URL` |

## Variables

Voir `.env.example` : notamment `VITE_API_URL`, `VITE_MAPTILER_KEY`.
