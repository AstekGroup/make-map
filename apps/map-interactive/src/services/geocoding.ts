/**
 * Service de géocodage utilisant api-adresse.data.gouv.fr
 * 
 * API gratuite du gouvernement français, sans clé API.
 * Géocode les adresses françaises en coordonnées GPS.
 * Inclut un cache localStorage pour éviter les appels répétitifs.
 */

// ============================================================
// Types
// ============================================================

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  region: string;
  department: string;
  cityCode: string;
}

interface BanFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    id: string;
    type: string;
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    city: string;
    context: string; // "01, Ain, Auvergne-Rhône-Alpes"
    importance: number;
  };
}

interface BanResponse {
  type: 'FeatureCollection';
  version: string;
  features: BanFeature[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
}

// ============================================================
// Table de correspondance code département -> région
// ============================================================

const DEPT_TO_REGION: Record<string, string> = {
  '01': 'Auvergne-Rhône-Alpes', '03': 'Auvergne-Rhône-Alpes', '07': 'Auvergne-Rhône-Alpes',
  '15': 'Auvergne-Rhône-Alpes', '26': 'Auvergne-Rhône-Alpes', '38': 'Auvergne-Rhône-Alpes',
  '42': 'Auvergne-Rhône-Alpes', '43': 'Auvergne-Rhône-Alpes', '63': 'Auvergne-Rhône-Alpes',
  '69': 'Auvergne-Rhône-Alpes', '73': 'Auvergne-Rhône-Alpes', '74': 'Auvergne-Rhône-Alpes',
  '21': 'Bourgogne-Franche-Comté', '25': 'Bourgogne-Franche-Comté', '39': 'Bourgogne-Franche-Comté',
  '58': 'Bourgogne-Franche-Comté', '70': 'Bourgogne-Franche-Comté', '71': 'Bourgogne-Franche-Comté',
  '89': 'Bourgogne-Franche-Comté', '90': 'Bourgogne-Franche-Comté',
  '22': 'Bretagne', '29': 'Bretagne', '35': 'Bretagne', '56': 'Bretagne',
  '18': 'Centre-Val de Loire', '28': 'Centre-Val de Loire', '36': 'Centre-Val de Loire',
  '37': 'Centre-Val de Loire', '41': 'Centre-Val de Loire', '45': 'Centre-Val de Loire',
  '2A': 'Corse', '2B': 'Corse', '20': 'Corse',
  '08': 'Grand Est', '10': 'Grand Est', '51': 'Grand Est', '52': 'Grand Est',
  '54': 'Grand Est', '55': 'Grand Est', '57': 'Grand Est', '67': 'Grand Est',
  '68': 'Grand Est', '88': 'Grand Est',
  '02': 'Hauts-de-France', '59': 'Hauts-de-France', '60': 'Hauts-de-France',
  '62': 'Hauts-de-France', '80': 'Hauts-de-France',
  '75': 'Île-de-France', '77': 'Île-de-France', '78': 'Île-de-France',
  '91': 'Île-de-France', '92': 'Île-de-France', '93': 'Île-de-France',
  '94': 'Île-de-France', '95': 'Île-de-France',
  '14': 'Normandie', '27': 'Normandie', '50': 'Normandie', '61': 'Normandie', '76': 'Normandie',
  '16': 'Nouvelle-Aquitaine', '17': 'Nouvelle-Aquitaine', '19': 'Nouvelle-Aquitaine',
  '23': 'Nouvelle-Aquitaine', '24': 'Nouvelle-Aquitaine', '33': 'Nouvelle-Aquitaine',
  '40': 'Nouvelle-Aquitaine', '47': 'Nouvelle-Aquitaine', '64': 'Nouvelle-Aquitaine',
  '79': 'Nouvelle-Aquitaine', '86': 'Nouvelle-Aquitaine', '87': 'Nouvelle-Aquitaine',
  '09': 'Occitanie', '11': 'Occitanie', '12': 'Occitanie', '30': 'Occitanie',
  '31': 'Occitanie', '32': 'Occitanie', '34': 'Occitanie', '46': 'Occitanie',
  '48': 'Occitanie', '65': 'Occitanie', '66': 'Occitanie', '81': 'Occitanie', '82': 'Occitanie',
  '44': 'Pays de la Loire', '49': 'Pays de la Loire', '53': 'Pays de la Loire',
  '72': 'Pays de la Loire', '85': 'Pays de la Loire',
  '04': 'Provence-Alpes-Côte d\'Azur', '05': 'Provence-Alpes-Côte d\'Azur',
  '06': 'Provence-Alpes-Côte d\'Azur', '13': 'Provence-Alpes-Côte d\'Azur',
  '83': 'Provence-Alpes-Côte d\'Azur', '84': 'Provence-Alpes-Côte d\'Azur',
  // DOM-TOM
  '971': 'Guadeloupe', '972': 'Martinique', '973': 'Guyane',
  '974': 'La Réunion', '976': 'Mayotte',
};

// ============================================================
// Cache localStorage
// ============================================================

const CACHE_KEY = 'geocoding_cache';
const CACHE_VERSION = 1;

interface CacheEntry {
  result: GeocodingResult;
  timestamp: number;
}

interface CacheStore {
  version: number;
  entries: Record<string, CacheEntry>;
}

function getCacheKey(address: string, postalCode: string, city: string): string {
  return `${address}|${postalCode}|${city}`.toLowerCase().trim();
}

function loadCache(): CacheStore {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { version: CACHE_VERSION, entries: {} };
    const parsed = JSON.parse(raw) as CacheStore;
    if (parsed.version !== CACHE_VERSION) return { version: CACHE_VERSION, entries: {} };
    return parsed;
  } catch {
    return { version: CACHE_VERSION, entries: {} };
  }
}

function saveCache(store: CacheStore): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    // localStorage plein ou indisponible, on ignore
  }
}

function getFromCache(key: string): GeocodingResult | null {
  const store = loadCache();
  const entry = store.entries[key];
  if (!entry) return null;
  // Cache valide 7 jours
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - entry.timestamp > SEVEN_DAYS) return null;
  return entry.result;
}

function saveToCache(key: string, result: GeocodingResult): void {
  const store = loadCache();
  store.entries[key] = { result, timestamp: Date.now() };
  saveCache(store);
}

// ============================================================
// Dérivation région depuis code postal
// ============================================================

/**
 * Extrait le code département d'un code postal français
 */
function getDepartmentCode(postalCode: string): string {
  if (!postalCode) return '';
  const cp = postalCode.trim();
  // DOM-TOM : codes postaux 97x
  if (cp.startsWith('97')) return cp.substring(0, 3);
  // Corse : 20xxx -> 2A ou 2B (on retourne '20' qui est géré)
  if (cp.startsWith('20')) return '20';
  // Métropole : 2 premiers chiffres
  return cp.substring(0, 2);
}

/**
 * Dérive la région depuis un code postal
 */
export function getRegionFromPostalCode(postalCode: string): string {
  const deptCode = getDepartmentCode(postalCode);
  return DEPT_TO_REGION[deptCode] || 'Inconnue';
}

/**
 * Dérive le département (nom) depuis le contexte de l'API BAN
 * Le contexte est au format "01, Ain, Auvergne-Rhône-Alpes"
 */
function parseBanContext(context: string): { department: string; region: string } {
  const parts = context.split(',').map(s => s.trim());
  return {
    department: parts[1] || 'Inconnu',
    region: parts[2] || 'Inconnue',
  };
}

// ============================================================
// API de géocodage
// ============================================================

const BAN_API_URL = 'https://api-adresse.data.gouv.fr/search/';

/**
 * Géocode une adresse française via api-adresse.data.gouv.fr
 * Utilise le cache localStorage si disponible.
 */
export async function geocodeAddress(
  address: string,
  postalCode: string,
  city: string
): Promise<GeocodingResult | null> {
  // Vérifier le cache d'abord
  const cacheKey = getCacheKey(address, postalCode, city);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  // Construire la requête
  const query = [address, city].filter(Boolean).join(', ');
  if (!query) return null;

  const url = new URL(BAN_API_URL);
  url.searchParams.set('q', query);
  if (postalCode) url.searchParams.set('postcode', postalCode);
  url.searchParams.set('limit', '1');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.warn(`[Geocoding] Erreur HTTP ${response.status} pour "${query}"`);
      return null;
    }

    const data: BanResponse = await response.json();
    if (!data.features || data.features.length === 0) {
      console.warn(`[Geocoding] Aucun résultat pour "${query}"`);
      // Fallback : essayer juste avec le code postal et la ville
      if (address) {
        return geocodeAddress('', postalCode, city);
      }
      return null;
    }

    const feature = data.features[0];
    const [longitude, latitude] = feature.geometry.coordinates;
    const { department, region } = parseBanContext(feature.properties.context);

    const result: GeocodingResult = {
      latitude,
      longitude,
      region,
      department,
      cityCode: feature.properties.citycode,
    };

    // Sauvegarder dans le cache
    saveToCache(cacheKey, result);

    return result;
  } catch (error) {
    console.warn(`[Geocoding] Erreur réseau pour "${query}":`, error);
    return null;
  }
}

// ============================================================
// Batch geocoding
// ============================================================

interface GeocodingItem {
  id: string;
  address: string;
  postalCode: string;
  city: string;
}

/**
 * Géocode un lot d'adresses en parallèle avec throttling.
 * Traite par lots de BATCH_SIZE pour ne pas surcharger l'API.
 */
export async function batchGeocode(
  items: GeocodingItem[]
): Promise<Map<string, GeocodingResult | null>> {
  const BATCH_SIZE = 8;
  const DELAY_BETWEEN_BATCHES = 100; // ms
  const results = new Map<string, GeocodingResult | null>();

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const result = await geocodeAddress(item.address, item.postalCode, item.city);
        return { id: item.id, result };
      })
    );

    for (const { id, result } of batchResults) {
      results.set(id, result);
    }

    // Petit délai entre les lots pour ne pas surcharger l'API
    if (i + BATCH_SIZE < items.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  return results;
}

/**
 * Vide le cache de géocodage (utile pour le debug)
 */
export function clearGeocodingCache(): void {
  localStorage.removeItem(CACHE_KEY);
}
