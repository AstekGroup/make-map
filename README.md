# Make Map - Semaine de l'IA pour Tous

Projet de carte interactive pour visualiser les événements de la Semaine de l'IA pour Tous.

## Structure du projet

```
make-map/
├── apps/
│   └── map-interactive/    # Application React de la carte
├── resources/              # Ressources et analyses
│   ├── analyse-semaine-ia-fr.md
│   ├── analyse-frameworks-carte-interactive.md
│   └── original-design-system/
├── DEVPLAN.md              # Plan de développement
└── PROJECT_VIBE_CONF.md    # Configuration du projet
```

## Applications

### map-interactive

Application React standalone pour afficher 1500 événements sur une carte interactive.

**Stack** : React 18 + Vite + MapLibre GL JS + Tailwind CSS

```bash
cd apps/map-interactive
pnpm install
pnpm dev
```

➡️ [Voir le README détaillé](apps/map-interactive/README.md)

## Ressources

- [Analyse du site semaine-ia.fr](resources/analyse-semaine-ia-fr.md)
- [Analyse des frameworks carte](resources/analyse-frameworks-carte-interactive.md)

## Liens utiles

- Site : https://semaine-ia.fr
- Organisateur : [La Mednum](https://lamednum.coop)

---

**POC - Innovation Lab**
