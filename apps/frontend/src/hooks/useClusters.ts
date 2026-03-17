import { useMemo, useCallback } from 'react';
import Supercluster from 'supercluster';
import { EventsGeoJSON, GeoJSONEvent, ClusterFeature, MapFeature } from '@/types/event';

// Décale légèrement les événements ayant exactement les mêmes coordonnées
// pour qu'ils restent cliquables individuellement au zoom max.
function jitterDuplicateCoordinates(features: GeoJSONEvent[]): GeoJSONEvent[] {
  const groups = new Map<string, GeoJSONEvent[]>();
  for (const f of features) {
    const key = `${f.geometry.coordinates[0]},${f.geometry.coordinates[1]}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(f);
  }
  const result: GeoJSONEvent[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      result.push(group[0]);
    } else {
      const radius = 0.00008; // ~8m — imperceptible sur la carte
      group.forEach((f, i) => {
        const angle = (2 * Math.PI * i) / group.length;
        const [lng, lat] = f.geometry.coordinates;
        result.push({
          ...f,
          geometry: {
            ...f.geometry,
            coordinates: [lng + radius * Math.cos(angle), lat + radius * Math.sin(angle)],
          },
        });
      });
    }
  }
  return result;
}

interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

interface UseClustersOptions {
  radius?: number;
  maxZoom?: number;
  minZoom?: number;
}

export function useClusters(
  geojson: EventsGeoJSON,
  bounds: BoundingBox | null,
  zoom: number,
  options: UseClustersOptions = {}
) {
  const { radius = 75, maxZoom = 16, minZoom = 0 } = options;

  // Créer l'instance Supercluster
  const supercluster = useMemo(() => {
    const index = new Supercluster<GeoJSONEvent['properties'], ClusterFeature['properties']>({
      radius,
      maxZoom,
      minZoom,
    });

    if (geojson.features.length > 0) {
      index.load(jitterDuplicateCoordinates(geojson.features));
    }

    return index;
  }, [geojson, radius, maxZoom, minZoom]);

  // Obtenir les clusters pour la vue actuelle
  const clusters = useMemo((): MapFeature[] => {
    if (!bounds || !supercluster) return [];

    const bbox: [number, number, number, number] = [
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north,
    ];

    try {
      return supercluster.getClusters(bbox, Math.floor(zoom)) as MapFeature[];
    } catch {
      return [];
    }
  }, [bounds, zoom, supercluster]);

  // Obtenir les enfants d'un cluster
  const getClusterChildren = useCallback(
    (clusterId: number): GeoJSONEvent[] => {
      if (!supercluster) return [];
      try {
        return supercluster.getLeaves(clusterId, Infinity) as GeoJSONEvent[];
      } catch {
        return [];
      }
    },
    [supercluster]
  );

  // Obtenir le zoom d'expansion d'un cluster
  const getClusterExpansionZoom = useCallback(
    (clusterId: number): number => {
      if (!supercluster) return zoom;
      try {
        return Math.min(supercluster.getClusterExpansionZoom(clusterId), maxZoom);
      } catch {
        return zoom;
      }
    },
    [supercluster, zoom, maxZoom]
  );

  // Stats des clusters
  const clusterStats = useMemo(() => {
    const clusterCount = clusters.filter(
      c => 'cluster' in c.properties && c.properties.cluster
    ).length;
    const pointCount = clusters.filter(
      c => !('cluster' in c.properties && c.properties.cluster)
    ).length;
    
    return {
      clusters: clusterCount,
      points: pointCount,
      total: clusters.length,
    };
  }, [clusters]);

  return {
    clusters,
    supercluster,
    getClusterChildren,
    getClusterExpansionZoom,
    clusterStats,
  };
}
