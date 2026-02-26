import { useState, useEffect, useMemo, useCallback } from 'react';
import { Event, EventType, EventsGeoJSON } from '@/types/event';
import { fetchEvents, eventsToGeoJSON } from '@/services/api';

export interface EventFilters {
  search: string;
  dateFilter: 'all' | 'during-week' | 'other';
  regions: string[];
  types: EventType[];
  postalCode: string;
  modality: 'all' | 'presentiel' | 'distanciel';
}

const initialFilters: EventFilters = {
  search: '',
  dateFilter: 'all',
  regions: [],
  types: [],
  postalCode: '',
  modality: 'all',
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [devMode, setDevMode] = useState(false);

  // Charger les événements depuis Airtable (ou fallback mock)
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents(devMode);
        setEvents(data);
      } catch (err) {
        console.error('[useEvents] Erreur lors du chargement:', err);
        setError(err instanceof Error ? err : new Error('Erreur lors du chargement des événements'));
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [devMode]);

  // Filtrer les événements
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filtre recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.city.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower) ||
          event.region.toLowerCase().includes(searchLower) ||
          (event.venueName && event.venueName.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Filtre modalité
      if (filters.modality !== 'all' && event.modality !== filters.modality) return false;

      // Filtre date
      if (filters.dateFilter === 'during-week' && !event.isDuringWeek) return false;
      if (filters.dateFilter === 'other' && event.isDuringWeek) return false;

      // Filtre régions
      if (filters.regions.length > 0 && !filters.regions.includes(event.region)) return false;

      // Filtre types
      if (filters.types.length > 0 && !filters.types.includes(event.type)) return false;

      // Filtre code postal
      if (filters.postalCode) {
        const postalCodeFilter = filters.postalCode.trim();
        if (!event.postalCode.startsWith(postalCodeFilter)) return false;
      }

      return true;
    });
  }, [events, filters]);

  // Convertir en GeoJSON (exclut automatiquement les événements sans coordonnées)
  const geojson: EventsGeoJSON = useMemo(() => {
    return eventsToGeoJSON(filteredEvents);
  }, [filteredEvents]);

  // Actions sur les filtres
  const updateFilters = (newFilters: Partial<EventFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const toggleRegion = (region: string) => {
    setFilters(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region],
    }));
  };

  const toggleType = (type: EventType) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type],
    }));
  };

  // Toggle mode dev (afficher tous les événements vs validés seulement)
  const toggleDevMode = useCallback(() => {
    setDevMode(prev => !prev);
  }, []);

  // Stats
  const stats = useMemo(() => ({
    total: events.length,
    filtered: filteredEvents.length,
    duringWeek: events.filter(e => e.isDuringWeek).length,
    byType: Object.fromEntries(
      (['cafe-ia', 'atelier', 'conference', 'jeu', 'autre'] as EventType[]).map(type => [
        type,
        filteredEvents.filter(e => e.type === type).length,
      ])
    ) as Record<EventType, number>,
    byRegion: Object.fromEntries(
      [...new Set(events.map(e => e.region))].map(region => [
        region,
        filteredEvents.filter(e => e.region === region).length,
      ])
    ) as Record<string, number>,
  }), [events, filteredEvents]);

  return {
    events: filteredEvents,
    allEvents: events,
    geojson,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    toggleRegion,
    toggleType,
    stats,
    devMode,
    toggleDevMode,
  };
}
