import { useMemo, useCallback } from 'react';
import Supercluster from 'supercluster';
import { EventsGeoJSON, GeoJSONEvent, ClusterFeature, MapFeature } from '@/types/event';

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
      index.load(geojson.features);
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
