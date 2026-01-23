import { EventFilters } from '@/hooks';
import { EventType, EVENT_TYPE_LABELS, REGIONS } from '@/types/event';
import { Calendar, MapPin, Tag, RotateCcw } from 'lucide-react';
import { Button } from '@/components/UI';

interface FilterPanelProps {
  filters: EventFilters;
  onUpdateFilters: (filters: Partial<EventFilters>) => void;
  onToggleRegion: (region: string) => void;
  onToggleType: (type: string) => void;
  onResetFilters: () => void;
  stats: {
    total: number;
    filtered: number;
    duringWeek: number;
  };
}

const EVENT_TYPES: EventType[] = ['cafe-ia', 'atelier', 'conference', 'jeu', 'autre'];

export function FilterPanel({
  filters,
  onUpdateFilters,
  onToggleRegion,
  onToggleType,
  onResetFilters,
}: FilterPanelProps) {
  const hasActiveFilters =
    filters.regions.length > 0 ||
    filters.types.length > 0 ||
    filters.dateFilter !== 'all';

  return (
    <div className="p-4 space-y-6">
      {/* Filtre par date */}
      <div>
        <h3 className="flex items-center gap-2 font-rubik font-semibold text-primary mb-3">
          <Calendar className="w-4 h-4 text-accent-coral" />
          Date
        </h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'Tous les événements' },
            { value: 'during-week', label: 'Pendant la Semaine de l\'IA (18-24 mai)' },
            { value: 'other', label: 'Autres dates' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="dateFilter"
                value={option.value}
                checked={filters.dateFilter === option.value}
                onChange={() =>
                  onUpdateFilters({ dateFilter: option.value as EventFilters['dateFilter'] })
                }
                className="w-4 h-4 text-accent-coral border-primary/30 focus:ring-accent-coral"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtre par type */}
      <div>
        <h3 className="flex items-center gap-2 font-rubik font-semibold text-primary mb-3">
          <Tag className="w-4 h-4 text-accent-coral" />
          Type d'événement
        </h3>
        <div className="space-y-2">
          {EVENT_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={() => onToggleType(type)}
                className="w-4 h-4 text-accent-coral border-primary/30 rounded focus:ring-accent-coral"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {EVENT_TYPE_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtre par région */}
      <div>
        <h3 className="flex items-center gap-2 font-rubik font-semibold text-primary mb-3">
          <MapPin className="w-4 h-4 text-accent-coral" />
          Région
        </h3>
        <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-2 pr-2">
          {REGIONS.filter(r => !['Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'].includes(r)).map((region) => (
            <label
              key={region}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.regions.includes(region)}
                onChange={() => onToggleRegion(region)}
                className="w-4 h-4 text-accent-coral border-primary/30 rounded focus:ring-accent-coral"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {region}
              </span>
            </label>
          ))}
          
          {/* DOM-TOM */}
          <div className="pt-2 mt-2 border-t border-primary/10">
            <p className="text-xs text-text-secondary mb-2 font-medium">Outre-mer</p>
            {REGIONS.filter(r => ['Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'].includes(r)).map((region) => (
              <label
                key={region}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.regions.includes(region)}
                  onChange={() => onToggleRegion(region)}
                  className="w-4 h-4 text-accent-coral border-primary/30 rounded focus:ring-accent-coral"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  {region}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton réinitialiser */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}
