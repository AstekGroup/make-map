# AGENTS.md — `@make-map/types`

[← Instructions racine](../../AGENTS.md) · [Frontend](../../apps/frontend/AGENTS.md) · [Backend](../../apps/backend/AGENTS.md)

## Rôle

Package **`@make-map/types`** : source de vérité TypeScript pour `Event`, enums (`EventType`, `EventFormat`, etc.), GeoJSON, labels (`EVENT_TYPE_LABELS`, …), `REGIONS`.

## Règle de modification

1. Modifier d’abord **`src/event.ts`** (et exports dans `src/index.ts` si besoin).
2. **`pnpm build`** dans ce package (ou laisser Turbo le faire depuis la racine).
3. Vérifier que **frontend** et **backend** compilent après changement de contrat.

## Commandes (depuis `shared/types`)

```bash
pnpm build
```

Depuis la racine : `pnpm build --filter=@make-map/types` (ou build global).
