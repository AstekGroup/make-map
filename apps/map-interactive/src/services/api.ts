/**
 * Service API Airtable
 * 
 * Récupère les événements depuis la table Airtable "Événements",
 * transforme les enregistrements en modèle Event interne,
 * et géocode les adresses via api-adresse.data.gouv.fr.
 * 
 * Fallback automatique vers les données mockées si Airtable n'est pas configuré.
 */

import { Event, EventsGeoJSON, GeoJSONEvent } from '@/types/event';
import { batchGeocode } from './geocoding';
import {
  mapFormat,
  mapTargetAudience,
  mapModality,
  extractImageUrl,
  computeIsDuringWeek,
  parseAirtableDateTime,
  buildOrganizerContact,
  buildAccessibilityInfo,
  AirtableAttachment,
} from './airtableMapping';
import { getRegionFromPostalCode } from './geocoding';

// ============================================================
// Configuration
// ============================================================

const AIRTABLE_CONFIG = {
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY || '',
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
  tableId: import.meta.env.VITE_AIRTABLE_TABLE_ID || '',
};

// ============================================================
// Types Airtable (noms de champs réels en français)
// ============================================================

interface AirtableRecord {
  id: string;
  fields: {
    'Nom de l\'événement'?: string;
    'Description'?: string;
    'Date de début de l\'événement'?: string;
    'Date de fin de l\'événement'?: string;
    'Lieu'?: string;
    'Format'?: string;
    'Type de l\'événement'?: string; // = Modalité (Présentiel / Distanciel)
    'Adresse du lieu'?: string;
    'Code postal du lieu'?: string;
    'Ville du lieu'?: string;
    'Modalités spécifiques d\'accès au lieu'?: string[];
    'Lien de la visio'?: string;
    'Modalités de visio'?: string[];
    'Capacité d\'accueil de l\'événement'?: number;
    'Email contact événement'?: string;
    'Nom de la structure organisatrice'?: string;
    'Site web de la structure'?: string;
    'Lien d\'inscription à l\'événement'?: string;
    'Prénom de l\'animateur'?: string;
    'Nom de l\'animateur'?: string;
    'E-mail de l\'animateur'?: string;
    'Téléphone de l\'animateur'?: string;
    'Modération de l\'événement'?: string;
    'Visibilité sur la cartographie'?: string;
    'Public'?: string[];
    'Visuel de l\'événement'?: AirtableAttachment[];
    'Respect de la charte'?: boolean;
    'Réception kit communication'?: string;
    'Type de structure'?: string;
    'Comment avez-vous connu La Semaine de l\'IA pour Tous ?'?: string[];
    'Avez-vous quelque chose à ajouter ?'?: string;
    'Inscription NL'?: string[];
  };
  createdTime?: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// ============================================================
// Valeurs de modération / visibilité connues
// ============================================================

// Valeurs qui EXCLUENT un événement de la cartographie
const MODERATION_EXCLUDED = 'Evénement validé à ne pas rendre visible';
const VISIBILITY_NOT_PUBLIC = "Je souhaite qu'il soit comptabilisé dans la Semaine de l'IA pour Tous mais non visible pour le grand public";

// ============================================================
// Transformation Airtable -> Event
// ============================================================

/**
 * Transforme un enregistrement Airtable en Event (sans géocodage).
 * Le géocodage est fait en batch après la récupération de tous les records.
 */
function transformAirtableRecord(record: AirtableRecord): Omit<Event, 'latitude' | 'longitude' | 'region' | 'department'> & {
  latitude: number;
  longitude: number;
  region: string;
  department: string;
} {
  const f = record.fields;

  // Parse dates
  const startDateTime = parseAirtableDateTime(f['Date de début de l\'événement']);
  const endDateTime = parseAirtableDateTime(f['Date de fin de l\'événement']);

  // Mapping format + type
  const { format, type } = mapFormat(f['Format']);

  // Mapping modalité
  const modality = mapModality(f['Type de l\'événement']);

  // Mapping public
  const targetAudience = mapTargetAudience(f['Public']);

  // Image
  const imageUrl = extractImageUrl(f['Visuel de l\'événement']);

  // isDuringWeek
  const isDuringWeek = computeIsDuringWeek(f['Date de début de l\'événement']);

  // Contact animateur
  const organizerContact = buildOrganizerContact(
    f['Prénom de l\'animateur'],
    f['Nom de l\'animateur']
  );

  // Accessibilité
  const accessibilityInfo = buildAccessibilityInfo(f['Modalités spécifiques d\'accès au lieu']);

  // Région par défaut depuis code postal (sera mise à jour par le géocodage)
  // Trim nécessaire car certains enregistrements Airtable ont des espaces en trop
  const postalCode = (f['Code postal du lieu'] || '').trim();
  const fallbackRegion = getRegionFromPostalCode(postalCode);

  return {
    id: record.id,
    title: f['Nom de l\'événement'] || 'Événement sans titre',
    description: f['Description'] || '',
    date: startDateTime.date,
    time: startDateTime.time,
    endDate: endDateTime.date || undefined,
    endTime: endDateTime.time || undefined,
    address: (f['Adresse du lieu'] || '').trim(),
    city: (f['Ville du lieu'] || '').trim(),
    region: fallbackRegion,
    department: '',
    postalCode,
    latitude: 0,
    longitude: 0,
    type,
    organizer: f['Nom de la structure organisatrice'] || '',
    organizerContact,
    registrationUrl: f['Lien d\'inscription à l\'événement'] || undefined,
    isDuringWeek,
    modality,
    imageUrl,
    venueName: f['Lieu'] || undefined,
    accessibilityInfo,
    videoConferenceUrl: f['Lien de la visio'] || undefined,
    format,
    targetAudience,
    contactEmail: f['Email contact événement'] || f['E-mail de l\'animateur'] || undefined,
    organizerWebsite: f['Site web de la structure'] || undefined,
    capacity: f['Capacité d\'accueil de l\'événement'] || undefined,
    registeredCount: undefined,
  };
}

// ============================================================
// Fetch avec pagination et filtre
// ============================================================

/**
 * Construit la formule de filtre Airtable.
 * 
 * Approche permissive : on EXCLUT uniquement les événements explicitement
 * marqués comme non visibles. Les événements sans modération renseignée
 * sont inclus (la plupart des événements n'ont pas encore été modérés).
 */
function buildFilterFormula(devMode: boolean): string | null {
  if (devMode) return null;
  
  // Exclure les événements explicitement non visibles
  return `AND({Modération de l'événement} != "${MODERATION_EXCLUDED}", {Visibilité sur la cartographie} != "${VISIBILITY_NOT_PUBLIC}")`;
}

/**
 * Récupère tous les enregistrements depuis Airtable avec pagination.
 * Applique le filtre de modération sauf en mode dev.
 */
async function fetchAirtableRecords(devMode: boolean): Promise<AirtableRecord[]> {
  const { apiKey, baseId, tableId } = AIRTABLE_CONFIG;

  if (!apiKey || !baseId || !tableId) {
    throw new Error('Configuration Airtable manquante. Vérifiez VITE_AIRTABLE_API_KEY, VITE_AIRTABLE_BASE_ID et VITE_AIRTABLE_TABLE_ID.');
  }

  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set('pageSize', '100');
    
    if (offset) {
      url.searchParams.set('offset', offset);
    }

    const filterFormula = buildFilterFormula(devMode);
    if (filterFormula) {
      url.searchParams.set('filterByFormula', filterFormula);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[Airtable] Erreur API:', response.status, errorBody);
      throw new Error(`Erreur Airtable: ${response.status} ${response.statusText}`);
    }

    const data: AirtableResponse = await response.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

// ============================================================
// Pipeline complet : fetch + transform + geocode
// ============================================================

/**
 * Récupère et transforme tous les événements depuis Airtable.
 * Inclut le géocodage des adresses.
 * 
 * @param devMode - Si true, récupère TOUS les événements (pas de filtre modération)
 */
export async function fetchEventsFromAirtable(devMode = false): Promise<Event[]> {
  console.log(`[API] Chargement des événements depuis Airtable (mode ${devMode ? 'dev' : 'production'})...`);

  // 1. Récupérer les enregistrements bruts
  const records = await fetchAirtableRecords(devMode);
  console.log(`[API] ${records.length} enregistrements récupérés depuis Airtable`);

  // 2. Transformer sans géocodage
  const partialEvents = records.map(transformAirtableRecord);

  // 3. Préparer le batch geocoding (seulement pour les événements présentiels avec adresse)
  const itemsToGeocode = partialEvents
    .filter(e => e.modality === 'presentiel' && (e.address || e.city))
    .map(e => ({
      id: e.id,
      address: e.address,
      postalCode: e.postalCode,
      city: e.city,
    }));

  console.log(`[API] Géocodage de ${itemsToGeocode.length} adresses...`);

  // 4. Géocoder en batch
  const geocodingResults = await batchGeocode(itemsToGeocode);

  // 5. Fusionner les résultats de géocodage
  const events: Event[] = partialEvents.map(event => {
    const geo = geocodingResults.get(event.id);
    if (geo) {
      return {
        ...event,
        latitude: geo.latitude,
        longitude: geo.longitude,
        region: geo.region || event.region,
        department: geo.department || event.department,
      };
    }
    return event;
  });

  console.log(`[API] ${events.length} événements prêts (${events.filter(e => e.latitude !== 0).length} géocodés)`);

  return events;
}

// ============================================================
// Fonctions utilitaires
// ============================================================

/**
 * Vérifie si l'API Airtable est configurée
 */
export function isAirtableConfigured(): boolean {
  return Boolean(AIRTABLE_CONFIG.apiKey && AIRTABLE_CONFIG.baseId && AIRTABLE_CONFIG.tableId);
}

/**
 * Point d'entrée principal pour récupérer les événements.
 * Utilise Airtable si configuré, sinon les données mockées.
 * 
 * @param devMode - Si true, récupère tous les événements sans filtre modération
 */
export async function fetchEvents(devMode = false): Promise<Event[]> {
  if (isAirtableConfigured()) {
    return fetchEventsFromAirtable(devMode);
  }

  // Fallback sur les données mockées
  console.log('[API] Airtable non configuré, utilisation des données mockées');
  const { MOCK_EVENTS } = await import('@/data/mockEvents');
  return MOCK_EVENTS;
}

// ============================================================
// Utilitaire GeoJSON (déplacé depuis mockEvents.ts)
// ============================================================

/**
 * Convertit un tableau d'événements en GeoJSON FeatureCollection.
 * Exclut les événements sans coordonnées valides (distanciels, non géocodés).
 */
export function eventsToGeoJSON(events: Event[]): EventsGeoJSON {
  return {
    type: 'FeatureCollection',
    features: events
      .filter(event => event.latitude !== 0 && event.longitude !== 0)
      .map((event): GeoJSONEvent => ({
        type: 'Feature',
        properties: event,
        geometry: {
          type: 'Point',
          coordinates: [event.longitude, event.latitude],
        },
      })),
  };
}
