export type EventType = 'cafe-ia' | 'atelier' | 'conference' | 'jeu' | 'autre';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  city: string;
  region: string;
  department: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  type: EventType;
  organizer: string;
  organizerContact?: string;
  registrationUrl?: string;
  isDuringWeek: boolean;
}

export interface GeoJSONEvent {
  type: 'Feature';
  properties: Event;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface EventsGeoJSON {
  type: 'FeatureCollection';
  features: GeoJSONEvent[];
}

export interface ClusterProperties {
  cluster: boolean;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string | number;
}

export type ClusterFeature = {
  type: 'Feature';
  properties: ClusterProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  id: number;
};

export type EventFeature = GeoJSONEvent;

export type MapFeature = ClusterFeature | EventFeature;

export function isCluster(feature: MapFeature): feature is ClusterFeature {
  return 'cluster' in feature.properties && feature.properties.cluster === true;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'cafe-ia': 'Café IA',
  'atelier': 'Atelier',
  'conference': 'Conférence',
  'jeu': 'Jeu',
  'autre': 'Autre',
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  'cafe-ia': '#f56476',
  'atelier': '#003081',
  'conference': '#cc3366',
  'jeu': '#ffb347',
  'autre': '#69727d',
};

export const REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  'Provence-Alpes-Côte d\'Azur',
  'Guadeloupe',
  'Martinique',
  'Guyane',
  'La Réunion',
  'Mayotte',
] as const;

export type Region = typeof REGIONS[number];
