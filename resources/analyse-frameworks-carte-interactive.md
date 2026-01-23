# Analyse des frameworks pour la carte interactive - Semaine de l'IA pour Tous

**Date d'analyse :** 9 janvier 2026  
**Contexte :** Carte interactive pour afficher 1500 événements sur le territoire français  
**Objectif :** Identifier la meilleure solution technique pour une carte performante et scalable

## 1. Contexte et exigences

### 1.1 Volume de données
- **1500 événements** à afficher simultanément sur une carte de France
- Potentiel de croissance future (nouvelles vagues d'AMI prévues en 2026)
- Besoin de **clustering intelligent** pour une navigation fluide
- Filtrage par région, type d'événement, date

### 1.2 Contraintes techniques
- Performance : éviter les ralentissements avec un grand nombre de marqueurs
- Expérience utilisateur : interactions fluides (zoom, pan, hover, click)
- Scalabilité : solution adaptable à une croissance des données
- Coût : préférence pour des solutions open-source
- Intégration : compatibilité avec React/Vue.js (selon stack technique choisie)

## 2. Solutions analysées

### 2.1 MapLibre GL JS + Deck.gl ⭐ (Meilleur choix global)

#### Description
**MapLibre GL JS** utilise WebGL pour renderer les cartes vectorielles de manière fluide, pouvant afficher des centaines de milliers de points. **Deck.gl** permet de créer des visualisations WebGL 2D et 3D performantes sur MapLibre.

#### Avantages
- ✅ **Très developer-friendly** avec un ensemble riche d'outils pour projets complexes
- ✅ **Open-source** et sans coûts de licence
- ✅ **React-friendly** avec `react-map-gl`
- ✅ **Excellent support du clustering**
- ✅ **Performance WebGL** pour gérer de gros volumes de données
- ✅ **Visualisations avancées** possibles (3D, heatmaps, etc.)
- ✅ **Écosystème spécifique** pour les visualisations lourdes

#### Stack recommandé
```javascript
// Stack optimal React + MapLibre
import { Map, Marker, Popup } from 'react-map-gl'
import MaplibreGL from 'maplibre-gl'
import Supercluster from 'supercluster'
import DeckGL from '@deck.gl/react'

// 1. Charger 1500 événements
// 2. Utiliser Supercluster pour clustering
// 3. Renderer via MapLibre + Deck.gl pour WebGL
// 4. Ajouter interactions (click, hover, popups)
```

#### Cas d'usage
- Visualisations avancées (3D, densité)
- Applications nécessitant une haute performance
- Projets avec potentiel de croissance importante
- Applications React/React Native

#### Documentation
- MapLibre GL JS : https://maplibre.org/
- Deck.gl : https://deck.gl/
- react-map-gl : https://visgl.github.io/react-map-gl/

---

### 2.2 Leaflet + Supercluster ⭐ (Pour approche légère)

#### Description
**Leaflet** est une bibliothèque JavaScript open-source leader, ne pesant que 42 KB. **Supercluster** est construit pour haute performance et peut gérer très largement les grands datasets avec impact minimal sur la vitesse de rendering.

#### Avantages
- ✅ **Légère** (42 KB pour Leaflet)
- ✅ **Simplicité** d'utilisation et courbe d'apprentissage facile
- ✅ **Performance exceptionnelle** avec Supercluster (500k marqueurs en 1-2 secondes)
- ✅ **Memory-efficient** pour environnements contraints
- ✅ **Écosystème de plugins** très riche
- ✅ **Stable et mature** (utilisé par de nombreuses applications)

#### Performances en benchmark
- **Leaflet.markercluster** s'effondre en performance au-delà de 100k marqueurs
- **Supercluster** charge 500k marqueurs en 1-2 secondes
- Clustering de millions de points en millisecondes

#### Stack recommandé
```javascript
import L from 'leaflet'
import Supercluster from 'supercluster'
import 'leaflet.markercluster'

// 1. Initialiser la carte Leaflet
// 2. Créer instance Supercluster avec les événements
// 3. Gérer le clustering dynamique selon le zoom
// 4. Afficher les marqueurs groupés ou individuels
```

#### Cas d'usage
- Prototypes rapides
- Applications simples à modérées
- Besoin de légèreté et simplicité
- Compatible avec Vue.js, React, vanilla JS

#### Documentation
- Leaflet : https://leafletjs.com/
- Supercluster : https://github.com/mapbox/supercluster

---

### 2.3 ECharts + Mode WebGL ⭐ (Pour visualisations riches)

#### Description
**ECharts** choisit automatiquement le meilleur mode de rendering - Canvas par défaut pour l'efficacité, mais peut basculer en mode WebGL pour très gros volumes de données.

#### Avantages
- ✅ **Rendering adaptatif** (Canvas ou WebGL selon les besoins)
- ✅ **Intégration facile** avec React/Vue
- ✅ **Excellent pour heatmaps** et visualisations de densité
- ✅ **Libre et open-source** (projet Apache)
- ✅ **Performance maintenue** même sur connexions basses bande passante
- ✅ **Dashboards interactifs** intégrés

#### Cas d'usage
- Visualisations de densité d'événements
- Heatmaps géographiques
- Dashboards avec cartes intégrées
- Applications nécessitant des graphiques complexes

#### Documentation
- ECharts : https://echarts.apache.org/
- ECharts GL : https://echarts.apache.org/examples/en/index.html#chart-type-globe

---

### 2.4 OpenLayers (Pour cas complexes)

#### Description
**OpenLayers** offre des capacités de cartographie complètes - de simples affichages à visualisations géospatiales complexes.

#### Avantages
- ✅ **Support de multiples formats GIS** (GeoJSON, KML, WMS, GML, GeoRSS)
- ✅ **Rendering vectoriel** avancé
- ✅ **Heatmaps** et intégrations API externes
- ✅ **Idéal pour applications interactives** avec données en temps réel
- ✅ **Open-source**

#### Inconvénients
- ⚠️ **Courbe d'apprentissage plus difficile**
- ⚠️ **Plus complexe** pour des cas d'usage simples
- ⚠️ **Performance moindre** comparé à MapLibre/Deck.gl pour très gros volumes

#### Cas d'usage
- Applications GIS complexes
- Intégration de données multiples (WMS, WFS, etc.)
- Visualisations géospatiales avancées
- Applications nécessitant des fonctionnalités GIS professionnelles

#### Documentation
- OpenLayers : https://openlayers.org/

---

### 2.5 Mapbox GL JS (Solution premium)

#### Description
**Mapbox GL JS** est une solution commerciale basée sur WebGL, offrant des performances exceptionnelles et des tiles premium.

#### Avantages
- ✅ **Performance exceptionnelle** (WebGL natif)
- ✅ **Tiles premium** de haute qualité
- ✅ **Documentation excellente**
- ✅ **Écosystème riche**

#### Inconvénients
- ⚠️ **Coût** : modèle freemium avec limitations
- ⚠️ **Dépendance** à un service externe
- ⚠️ **MapLibre** est un fork open-source de Mapbox GL JS

#### Cas d'usage
- Applications nécessitant des tiles premium
- Budget disponible pour service payant
- Applications commerciales avec support professionnel

#### Documentation
- Mapbox GL JS : https://docs.mapbox.com/mapbox-gl-js/

---

## 3. Considérations critiques pour 1500 événements

### 3.1 Performance - Points-clés

#### Limites des marqueurs HTML
- ⚠️ Les **marqueurs HTML sont plus lents** que les marqueurs WebGL
- ⚠️ Pour éviter les problèmes de performance, **ne pas afficher plus de 100 marqueurs HTML simultanément**
- ✅ **Solution** : Réduire le nombre affiché via clustering

#### Rendering DOM vs WebGL
- ⚠️ Au-delà de **10k objets**, le rendering devient sluggish avec éléments DOM
- ⚠️ **Leaflet en mode Canvas** a ses limites au-delà de 100k objets
- ✅ **Solutions WebGL et Vector Tiles** performent très bien avec de gros volumes

#### Vector Tiles vs GeoJSON
Pour 1500 événements, deux approches possibles :

1. **GeoJSON directement**
   - ✅ Simple à implémenter
   - ⚠️ Moins performant pour très gros volumes
   - ✅ Suffisant pour 1500 événements avec clustering

2. **Vector Tiles**
   - ✅ Meilleur pour grandes données
   - ✅ Clustering côté serveur possible
   - ⚠️ Plus complexe à mettre en place
   - ✅ Recommandé si croissance future importante

### 3.2 Stratégies de clustering

#### Clustering côté client (recommandé pour 1500 événements)
- Utiliser **Supercluster** pour clustering en temps réel
- Ajuster dynamiquement selon le niveau de zoom
- Afficher le nombre d'événements dans chaque cluster

#### Clustering côté serveur (pour très gros volumes)
- Générer des Vector Tiles avec clustering pré-calculé
- Réduire la charge côté client
- Nécessite infrastructure serveur

### 3.3 Optimisations recommandées

1. **Lazy loading** : Charger les événements progressivement selon la zone visible
2. **Debouncing** : Limiter les recalculs lors du zoom/pan
3. **Memoization** : Mettre en cache les clusters calculés
4. **Virtualisation** : N'afficher que les marqueurs visibles à l'écran

## 4. Comparaison synthétique

| Solution | Performance | Courbe apprentissage | Coût | Cas d'usage |
|----------|-------------|---------------------|------|-------------|
| **MapLibre + Deck.gl** | ⭐⭐⭐⭐⭐ | Moyen | Gratuit | Visualisations avancées, 3D, haute performance |
| **Leaflet + Supercluster** | ⭐⭐⭐⭐ | Facile | Gratuit | Cas simples, clustering basique |
| **ECharts** | ⭐⭐⭐⭐ | Facile | Gratuit | Heatmaps, densités, dashboards |
| **Mapbox GL JS** | ⭐⭐⭐⭐⭐ | Moyen | Payant | Haute performance, tiles premium |
| **OpenLayers** | ⭐⭐⭐ | Difficile | Gratuit | GIS complexe, données multiples |

### Légende
- **Performance** : Capacité à gérer 1500+ événements avec fluidité
- **Courbe apprentissage** : Facilité de prise en main
- **Coût** : Coûts de licence et d'utilisation
- **Cas d'usage** : Scénarios d'utilisation recommandés

## 5. Recommandations finales

### 5.1 Approche 1 : MapLibre GL JS + Deck.gl + Supercluster ⭐ (Recommandée)

#### Pourquoi cette solution ?
- ✅ **Scalable** pour futures expansions (nouvelles vagues d'AMI)
- ✅ **Visualisations 3D possibles** (si besoin futur)
- ✅ **Entièrement open-source** (pas de coûts)
- ✅ **React-friendly** avec `react-map-gl`
- ✅ **Performance WebGL** optimale pour 1500+ événements
- ✅ **Écosystème mature** pour visualisations complexes

#### Stack technique complète
```javascript
// Dépendances principales
- maplibre-gl (carte de base)
- react-map-gl (wrapper React)
- @deck.gl/react (visualisations WebGL)
- supercluster (clustering)
- @deck.gl/layers (couches Deck.gl)
- @deck.gl/aggregation-layers (heatmaps, hexagons)
```

#### Architecture proposée
1. **Carte de base** : MapLibre GL JS via `react-map-gl`
2. **Clustering** : Supercluster pour grouper les événements
3. **Rendering** : Deck.gl pour afficher les points/clusters en WebGL
4. **Interactions** : Popups, tooltips, filtres intégrés
5. **Performance** : Lazy loading et virtualisation

#### Avantages spécifiques pour le projet
- Gestion fluide de 1500 événements dès le départ
- Prêt pour croissance (potentiel 5000+ événements)
- Visualisations avancées possibles (densité, heatmaps)
- Compatible avec stack React moderne
- Pas de dépendance à service externe payant

---

### 5.2 Approche 2 : Leaflet + Supercluster + Vue.js (Plus simple)

#### Pourquoi cette solution ?
- ✅ **Démarrage rapide** (courbe d'apprentissage facile)
- ✅ **Légère et stable** (42 KB pour Leaflet)
- ✅ **Excellent pour prototypes** et MVP
- ✅ **Performance suffisante** pour 1500 événements avec Supercluster
- ✅ **Écosystème de plugins** très riche

#### Stack technique complète
```javascript
// Dépendances principales
- leaflet (carte de base)
- supercluster (clustering)
- vue2-leaflet ou @vue-leaflet/vue-leaflet (wrapper Vue)
- leaflet.markercluster (alternative à Supercluster)
```

#### Architecture proposée
1. **Carte de base** : Leaflet
2. **Clustering** : Supercluster pour performance optimale
3. **Marqueurs** : Markers Leaflet avec custom icons
4. **Interactions** : Popups Leaflet natifs
5. **Filtres** : Composants Vue.js pour UI

#### Avantages spécifiques pour le projet
- Implémentation rapide (quelques jours)
- Légère et performante pour 1500 événements
- Facile à maintenir
- Idéale si stack Vue.js préférée

---

## 6. Plan d'implémentation recommandé

### 6.1 Phase 1 : MVP (Minimum Viable Product)
- **Durée estimée** : 1-2 semaines
- **Solution** : Leaflet + Supercluster (approche simple)
- **Fonctionnalités** :
  - Affichage des 1500 événements sur carte
  - Clustering automatique
  - Popups avec informations de base
  - Zoom et navigation basiques

### 6.2 Phase 2 : Améliorations
- **Durée estimée** : 2-3 semaines
- **Solution** : Migration vers MapLibre + Deck.gl (si besoin)
- **Fonctionnalités** :
  - Filtres avancés (date, type, région)
  - Recherche par mot-clé
  - Visualisations de densité
  - Export des données

### 6.3 Phase 3 : Optimisations
- **Durée estimée** : 1-2 semaines
- **Fonctionnalités** :
  - Lazy loading
  - Mise en cache
  - Optimisations de performance
  - Tests de charge

## 7. Ressources et documentation

### 7.1 MapLibre GL JS
- Site officiel : https://maplibre.org/
- Documentation : https://maplibre.org/maplibre-gl-js-docs/
- Exemples : https://maplibre.org/maplibre-gl-js-docs/example/
- GitHub : https://github.com/maplibre/maplibre-gl-js

### 7.2 Deck.gl
- Site officiel : https://deck.gl/
- Documentation : https://deck.gl/docs
- Exemples : https://deck.gl/examples
- GitHub : https://github.com/visgl/deck.gl

### 7.3 Leaflet
- Site officiel : https://leafletjs.com/
- Documentation : https://leafletjs.com/reference.html
- Exemples : https://leafletjs.com/examples.html
- GitHub : https://github.com/Leaflet/Leaflet

### 7.4 Supercluster
- Documentation : https://github.com/mapbox/supercluster
- NPM : https://www.npmjs.com/package/supercluster
- Performance benchmarks : Disponibles sur GitHub

### 7.5 react-map-gl
- Documentation : https://visgl.github.io/react-map-gl/
- Exemples : https://visgl.github.io/react-map-gl/examples
- GitHub : https://github.com/visgl/react-map-gl

## 8. Conclusion

Pour le projet de carte interactive de la **Semaine de l'IA pour Tous** avec **1500 événements** :

### Solution recommandée : **MapLibre GL JS + Deck.gl + Supercluster**

Cette combinaison offre le meilleur équilibre entre :
- ✅ **Performance** : WebGL pour gérer facilement 1500+ événements
- ✅ **Scalabilité** : Prête pour croissance future
- ✅ **Flexibilité** : Visualisations avancées possibles
- ✅ **Coût** : Entièrement open-source
- ✅ **Maintenabilité** : Écosystème moderne et bien documenté

### Alternative : **Leaflet + Supercluster**

Si besoin d'une solution plus simple et rapide à mettre en place :
- ✅ **Rapidité** : Développement plus rapide
- ✅ **Simplicité** : Courbe d'apprentissage facile
- ✅ **Performance** : Suffisante pour 1500 événements
- ⚠️ **Limite** : Moins scalable pour très gros volumes futurs

---

**Prochaines étapes recommandées :**
1. Valider le choix de framework avec l'équipe technique
2. Définir la structure de données des événements (format GeoJSON)
3. Créer un prototype avec la solution choisie
4. Tester les performances avec un échantillon de données réelles
5. Itérer et améliorer selon les retours utilisateurs

---

**Document créé le :** 9 janvier 2026  
**Auteur :** Analyse technique pour le projet make-map  
**Version :** 1.0
