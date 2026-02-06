export type EventType = 'cafe-ia' | 'atelier' | 'conference' | 'jeu' | 'autre';

export type EventFormat = 
  | 'debat' 
  | 'atelier' 
  | 'prise-en-main' 
  | 'conference' 
  | 'visite' 
  | 'cafe-ia' 
  | 'cine-debat' 
  | 'formation'
  | 'autre';

export type TargetAudience = 
  | 'tout-public' 
  | 'jeunes' 
  | 'seniors' 
  | 'qpv' 
  | 'scolaire' 
  | 'handicap' 
  | 'salaries' 
  | 'adherents';

export type EventModality = 'presentiel' | 'distanciel';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
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
  // Nouveaux champs
  modality: EventModality;
  imageUrl?: string;
  venueName?: string;
  accessibilityInfo?: string;
  videoConferenceUrl?: string;
  format: EventFormat;
  targetAudience: TargetAudience[];
  contactEmail?: string;
  organizerWebsite?: string;
  capacity?: number;
  registeredCount?: number;
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

export const EVENT_FORMAT_LABELS: Record<EventFormat, string> = {
  'debat': 'Débat',
  'atelier': 'Atelier',
  'prise-en-main': 'Prise en main d\'outil',
  'conference': 'Conférence/Table-ronde',
  'visite': 'Visite guidée/Portes ouvertes',
  'cafe-ia': 'Café IA',
  'cine-debat': 'Ciné-débat/Exposition/Festival',
  'formation': 'Formation',
  'autre': 'Autre',
};

export const TARGET_AUDIENCE_LABELS: Record<TargetAudience, string> = {
  'tout-public': 'Tout public',
  'jeunes': 'Jeunes',
  'seniors': 'Seniors',
  'qpv': 'Habitants de QPV',
  'scolaire': 'Scolaire',
  'handicap': 'Personnes porteuses d\'un handicap',
  'salaries': 'Salariés d\'une entreprise',
  'adherents': 'Adhérents d\'une structure',
};

export const MODALITY_LABELS: Record<EventModality, string> = {
  'presentiel': 'En présentiel',
  'distanciel': 'En ligne',
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
