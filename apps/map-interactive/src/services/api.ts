import { Event, EventType } from '@/types/event';

// Configuration API Airtable
// À remplir avec les vraies valeurs
const AIRTABLE_CONFIG = {
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY || '',
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
  tableName: 'Events',
};

interface AirtableRecord {
  id: string;
  fields: {
    Title: string;
    Description: string;
    Date: string;
    Time: string;
    Address: string;
    City: string;
    Region: string;
    Department: string;
    PostalCode: string;
    Latitude: number;
    Longitude: number;
    Type: string;
    Organizer: string;
    OrganizerContact?: string;
    RegistrationUrl?: string;
    IsDuringWeek: boolean;
  };
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

/**
 * Transforme un enregistrement Airtable en Event
 */
function transformAirtableRecord(record: AirtableRecord): Event {
  const { fields } = record;
  return {
    id: record.id,
    title: fields.Title,
    description: fields.Description,
    date: fields.Date,
    time: fields.Time,
    address: fields.Address,
    city: fields.City,
    region: fields.Region,
    department: fields.Department,
    postalCode: fields.PostalCode,
    latitude: fields.Latitude,
    longitude: fields.Longitude,
    type: fields.Type as EventType,
    organizer: fields.Organizer,
    organizerContact: fields.OrganizerContact,
    registrationUrl: fields.RegistrationUrl,
    isDuringWeek: fields.IsDuringWeek,
  };
}

/**
 * Récupère tous les événements depuis Airtable
 * Gère la pagination automatiquement
 */
export async function fetchEventsFromAirtable(): Promise<Event[]> {
  const { apiKey, baseId, tableName } = AIRTABLE_CONFIG;
  
  if (!apiKey || !baseId) {
    throw new Error('Configuration Airtable manquante. Vérifiez les variables d\'environnement.');
  }

  const events: Event[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableName}`);
    if (offset) {
      url.searchParams.set('offset', offset);
    }
    url.searchParams.set('pageSize', '100');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.status} ${response.statusText}`);
    }

    const data: AirtableResponse = await response.json();
    
    events.push(...data.records.map(transformAirtableRecord));
    offset = data.offset;
  } while (offset);

  return events;
}

/**
 * Vérifie si l'API Airtable est configurée
 */
export function isAirtableConfigured(): boolean {
  return Boolean(AIRTABLE_CONFIG.apiKey && AIRTABLE_CONFIG.baseId);
}

/**
 * API Service - Point d'entrée pour récupérer les événements
 * Utilise les données mockées si Airtable n'est pas configuré
 */
export async function fetchEvents(): Promise<Event[]> {
  if (isAirtableConfigured()) {
    return fetchEventsFromAirtable();
  }
  
  // Fallback sur les données mockées
  const { MOCK_EVENTS } = await import('@/data/mockEvents');
  return MOCK_EVENTS;
}
