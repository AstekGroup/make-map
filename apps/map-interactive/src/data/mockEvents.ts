import { Event, EventType, EventsGeoJSON, GeoJSONEvent } from '@/types/event';

// Coordonnées des principales villes françaises par région
const CITIES: Record<string, { name: string; lat: number; lng: number; department: string; postalCode: string }[]> = {
  'Île-de-France': [
    { name: 'Paris', lat: 48.8566, lng: 2.3522, department: 'Paris', postalCode: '75000' },
    { name: 'Boulogne-Billancourt', lat: 48.8356, lng: 2.2417, department: 'Hauts-de-Seine', postalCode: '92100' },
    { name: 'Saint-Denis', lat: 48.9362, lng: 2.3574, department: 'Seine-Saint-Denis', postalCode: '93200' },
    { name: 'Versailles', lat: 48.8014, lng: 2.1301, department: 'Yvelines', postalCode: '78000' },
    { name: 'Montreuil', lat: 48.8637, lng: 2.4433, department: 'Seine-Saint-Denis', postalCode: '93100' },
  ],
  'Auvergne-Rhône-Alpes': [
    { name: 'Lyon', lat: 45.7640, lng: 4.8357, department: 'Rhône', postalCode: '69000' },
    { name: 'Grenoble', lat: 45.1885, lng: 5.7245, department: 'Isère', postalCode: '38000' },
    { name: 'Saint-Étienne', lat: 45.4397, lng: 4.3872, department: 'Loire', postalCode: '42000' },
    { name: 'Clermont-Ferrand', lat: 45.7772, lng: 3.0870, department: 'Puy-de-Dôme', postalCode: '63000' },
    { name: 'Annecy', lat: 45.8992, lng: 6.1294, department: 'Haute-Savoie', postalCode: '74000' },
  ],
  'Nouvelle-Aquitaine': [
    { name: 'Bordeaux', lat: 44.8378, lng: -0.5792, department: 'Gironde', postalCode: '33000' },
    { name: 'Limoges', lat: 45.8336, lng: 1.2611, department: 'Haute-Vienne', postalCode: '87000' },
    { name: 'Poitiers', lat: 46.5802, lng: 0.3404, department: 'Vienne', postalCode: '86000' },
    { name: 'Pau', lat: 43.2951, lng: -0.3708, department: 'Pyrénées-Atlantiques', postalCode: '64000' },
    { name: 'La Rochelle', lat: 46.1603, lng: -1.1511, department: 'Charente-Maritime', postalCode: '17000' },
  ],
  'Occitanie': [
    { name: 'Toulouse', lat: 43.6047, lng: 1.4442, department: 'Haute-Garonne', postalCode: '31000' },
    { name: 'Montpellier', lat: 43.6108, lng: 3.8767, department: 'Hérault', postalCode: '34000' },
    { name: 'Nîmes', lat: 43.8367, lng: 4.3601, department: 'Gard', postalCode: '30000' },
    { name: 'Perpignan', lat: 42.6887, lng: 2.8948, department: 'Pyrénées-Orientales', postalCode: '66000' },
    { name: 'Albi', lat: 43.9298, lng: 2.1480, department: 'Tarn', postalCode: '81000' },
  ],
  'Hauts-de-France': [
    { name: 'Lille', lat: 50.6292, lng: 3.0573, department: 'Nord', postalCode: '59000' },
    { name: 'Amiens', lat: 49.8942, lng: 2.3027, department: 'Somme', postalCode: '80000' },
    { name: 'Roubaix', lat: 50.6942, lng: 3.1746, department: 'Nord', postalCode: '59100' },
    { name: 'Reims', lat: 49.2583, lng: 4.0317, department: 'Marne', postalCode: '51100' },
    { name: 'Dunkerque', lat: 51.0343, lng: 2.3768, department: 'Nord', postalCode: '59140' },
  ],
  'Provence-Alpes-Côte d\'Azur': [
    { name: 'Marseille', lat: 43.2965, lng: 5.3698, department: 'Bouches-du-Rhône', postalCode: '13000' },
    { name: 'Nice', lat: 43.7102, lng: 7.2620, department: 'Alpes-Maritimes', postalCode: '06000' },
    { name: 'Toulon', lat: 43.1242, lng: 5.9280, department: 'Var', postalCode: '83000' },
    { name: 'Aix-en-Provence', lat: 43.5297, lng: 5.4474, department: 'Bouches-du-Rhône', postalCode: '13100' },
    { name: 'Avignon', lat: 43.9493, lng: 4.8055, department: 'Vaucluse', postalCode: '84000' },
  ],
  'Grand Est': [
    { name: 'Strasbourg', lat: 48.5734, lng: 7.7521, department: 'Bas-Rhin', postalCode: '67000' },
    { name: 'Metz', lat: 49.1193, lng: 6.1757, department: 'Moselle', postalCode: '57000' },
    { name: 'Nancy', lat: 48.6921, lng: 6.1844, department: 'Meurthe-et-Moselle', postalCode: '54000' },
    { name: 'Mulhouse', lat: 47.7508, lng: 7.3359, department: 'Haut-Rhin', postalCode: '68100' },
    { name: 'Colmar', lat: 48.0794, lng: 7.3558, department: 'Haut-Rhin', postalCode: '68000' },
  ],
  'Pays de la Loire': [
    { name: 'Nantes', lat: 47.2184, lng: -1.5536, department: 'Loire-Atlantique', postalCode: '44000' },
    { name: 'Angers', lat: 47.4784, lng: -0.5632, department: 'Maine-et-Loire', postalCode: '49000' },
    { name: 'Le Mans', lat: 48.0061, lng: 0.1996, department: 'Sarthe', postalCode: '72000' },
    { name: 'Saint-Nazaire', lat: 47.2736, lng: -2.2137, department: 'Loire-Atlantique', postalCode: '44600' },
    { name: 'La Roche-sur-Yon', lat: 46.6706, lng: -1.4269, department: 'Vendée', postalCode: '85000' },
  ],
  'Bretagne': [
    { name: 'Rennes', lat: 48.1173, lng: -1.6778, department: 'Ille-et-Vilaine', postalCode: '35000' },
    { name: 'Brest', lat: 48.3904, lng: -4.4861, department: 'Finistère', postalCode: '29200' },
    { name: 'Quimper', lat: 47.9960, lng: -4.1024, department: 'Finistère', postalCode: '29000' },
    { name: 'Lorient', lat: 47.7483, lng: -3.3700, department: 'Morbihan', postalCode: '56100' },
    { name: 'Vannes', lat: 47.6586, lng: -2.7609, department: 'Morbihan', postalCode: '56000' },
  ],
  'Normandie': [
    { name: 'Rouen', lat: 49.4432, lng: 1.0999, department: 'Seine-Maritime', postalCode: '76000' },
    { name: 'Le Havre', lat: 49.4944, lng: 0.1079, department: 'Seine-Maritime', postalCode: '76600' },
    { name: 'Caen', lat: 49.1829, lng: -0.3707, department: 'Calvados', postalCode: '14000' },
    { name: 'Cherbourg', lat: 49.6337, lng: -1.6222, department: 'Manche', postalCode: '50100' },
    { name: 'Évreux', lat: 49.0270, lng: 1.1508, department: 'Eure', postalCode: '27000' },
  ],
  'Bourgogne-Franche-Comté': [
    { name: 'Dijon', lat: 47.3220, lng: 5.0415, department: 'Côte-d\'Or', postalCode: '21000' },
    { name: 'Besançon', lat: 47.2378, lng: 6.0241, department: 'Doubs', postalCode: '25000' },
    { name: 'Belfort', lat: 47.6400, lng: 6.8633, department: 'Territoire de Belfort', postalCode: '90000' },
    { name: 'Auxerre', lat: 47.7982, lng: 3.5673, department: 'Yonne', postalCode: '89000' },
    { name: 'Chalon-sur-Saône', lat: 46.7806, lng: 4.8536, department: 'Saône-et-Loire', postalCode: '71100' },
  ],
  'Centre-Val de Loire': [
    { name: 'Tours', lat: 47.3941, lng: 0.6848, department: 'Indre-et-Loire', postalCode: '37000' },
    { name: 'Orléans', lat: 47.9029, lng: 1.9093, department: 'Loiret', postalCode: '45000' },
    { name: 'Bourges', lat: 47.0833, lng: 2.4000, department: 'Cher', postalCode: '18000' },
    { name: 'Blois', lat: 47.5861, lng: 1.3359, department: 'Loir-et-Cher', postalCode: '41000' },
    { name: 'Chartres', lat: 48.4564, lng: 1.4837, department: 'Eure-et-Loir', postalCode: '28000' },
  ],
  'Corse': [
    { name: 'Ajaccio', lat: 41.9192, lng: 8.7386, department: 'Corse-du-Sud', postalCode: '20000' },
    { name: 'Bastia', lat: 42.7026, lng: 9.4508, department: 'Haute-Corse', postalCode: '20200' },
    { name: 'Porto-Vecchio', lat: 41.5917, lng: 9.2792, department: 'Corse-du-Sud', postalCode: '20137' },
    { name: 'Corte', lat: 42.3056, lng: 9.1492, department: 'Haute-Corse', postalCode: '20250' },
  ],
};

const EVENT_TYPES: EventType[] = ['cafe-ia', 'atelier', 'conference', 'jeu', 'autre'];

const EVENT_TITLES: Record<EventType, string[]> = {
  'cafe-ia': [
    'Café IA : Découverte de l\'intelligence artificielle',
    'Café IA : ChatGPT et vous',
    'Café IA : L\'IA au quotidien',
    'Café IA : Démystifier l\'IA',
    'Café IA : Questions-réponses sur l\'IA',
  ],
  'atelier': [
    'Atelier pratique : Premiers pas avec l\'IA',
    'Atelier créatif : Créer des images avec l\'IA',
    'Atelier numérique : L\'IA pour les seniors',
    'Atelier découverte : Les assistants vocaux',
    'Atelier pratique : Rédiger avec l\'IA',
  ],
  'conference': [
    'Conférence : Les enjeux éthiques de l\'IA',
    'Conférence : L\'IA et l\'emploi de demain',
    'Conférence : Comprendre le machine learning',
    'Conférence : L\'IA dans la santé',
    'Conférence : Sécurité et IA',
  ],
  'jeu': [
    'Jeu : Quiz sur l\'intelligence artificielle',
    'Jeu : Escape game numérique IA',
    'Jeu : Qui a peur de l\'IA ?',
    'Jeu interactif : IA ou humain ?',
    'Jeu de piste : Découvrir l\'IA en s\'amusant',
  ],
  'autre': [
    'Exposition : L\'histoire de l\'IA',
    'Table ronde : Parlons IA ensemble',
    'Démonstration : Les robots du quotidien',
    'Visite guidée : Un labo d\'IA',
    'Projection-débat : L\'IA au cinéma',
  ],
};

const ORGANIZERS = [
  'Association Médiation Numérique',
  'Médiathèque municipale',
  'Centre social et culturel',
  'Maison de quartier',
  'Espace public numérique',
  'Association d\'éducation populaire',
  'Fablab local',
  'Tiers-lieu numérique',
  'Bibliothèque universitaire',
  'Maison des associations',
  'Club informatique',
  'Association seniors connectés',
  'Centre de formation',
  'Coopérative numérique',
  'Pôle emploi',
];

// Générer un ID unique
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Générer une date aléatoire
function generateDate(isDuringWeek: boolean): { date: string; time: string } {
  let day: number;
  let month: number;
  
  if (isDuringWeek) {
    // Pendant la Semaine de l'IA (18-24 mai 2026)
    day = 18 + Math.floor(Math.random() * 7);
    month = 5;
  } else {
    // Autres dates au 1er semestre 2026
    month = 1 + Math.floor(Math.random() * 6);
    day = 1 + Math.floor(Math.random() * 28);
  }
  
  const hours = [9, 10, 11, 14, 15, 16, 17, 18, 19, 20];
  const hour = hours[Math.floor(Math.random() * hours.length)];
  const minutes = Math.random() > 0.5 ? '00' : '30';
  
  return {
    date: `2026-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    time: `${hour.toString().padStart(2, '0')}:${minutes}`,
  };
}

// Ajouter une légère variation aux coordonnées
function addVariation(lat: number, lng: number): { lat: number; lng: number } {
  const latVariation = (Math.random() - 0.5) * 0.05;
  const lngVariation = (Math.random() - 0.5) * 0.05;
  return {
    lat: lat + latVariation,
    lng: lng + lngVariation,
  };
}

// Générer un événement
function generateEvent(region: string, city: typeof CITIES[string][number], _index: number): Event {
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const titles = EVENT_TITLES[type];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const organizer = ORGANIZERS[Math.floor(Math.random() * ORGANIZERS.length)];
  const isDuringWeek = Math.random() > 0.3; // 70% pendant la semaine IA
  const { date, time } = generateDate(isDuringWeek);
  const coords = addVariation(city.lat, city.lng);
  
  return {
    id: generateId(),
    title: `${title} - ${city.name}`,
    description: `Rejoignez-nous pour cet événement de sensibilisation à l'intelligence artificielle organisé par ${organizer}. Une occasion unique de découvrir, comprendre et expérimenter l'IA dans un cadre convivial et accessible à tous.`,
    date,
    time,
    address: `${Math.floor(Math.random() * 100) + 1} rue de la République`,
    city: city.name,
    region,
    department: city.department,
    postalCode: city.postalCode,
    latitude: coords.lat,
    longitude: coords.lng,
    type,
    organizer,
    organizerContact: Math.random() > 0.3 ? `contact@${organizer.toLowerCase().replace(/\s+/g, '-')}.fr` : undefined,
    registrationUrl: Math.random() > 0.4 ? 'https://semaine-ia.fr/inscription' : undefined,
    isDuringWeek,
  };
}

// Générer 1500 événements
export function generateMockEvents(count: number = 1500): Event[] {
  const events: Event[] = [];
  const regions = Object.keys(CITIES);
  const eventsPerRegion = Math.ceil(count / regions.length);
  
  for (const region of regions) {
    const cities = CITIES[region];
    const eventsPerCity = Math.ceil(eventsPerRegion / cities.length);
    
    for (const city of cities) {
      for (let i = 0; i < eventsPerCity && events.length < count; i++) {
        events.push(generateEvent(region, city, i));
      }
    }
  }
  
  // Shuffle events for more natural distribution
  return events.sort(() => Math.random() - 0.5);
}

// Convertir en GeoJSON
export function eventsToGeoJSON(events: Event[]): EventsGeoJSON {
  return {
    type: 'FeatureCollection',
    features: events.map((event): GeoJSONEvent => ({
      type: 'Feature',
      properties: event,
      geometry: {
        type: 'Point',
        coordinates: [event.longitude, event.latitude],
      },
    })),
  };
}

// Export des événements mockés
export const MOCK_EVENTS = generateMockEvents(1500);
export const MOCK_GEOJSON = eventsToGeoJSON(MOCK_EVENTS);
