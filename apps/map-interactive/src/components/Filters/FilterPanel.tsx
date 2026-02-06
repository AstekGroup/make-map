import { EventFilters } from '@/hooks';
import { EventType, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, REGIONS } from '@/types/event';
import { Calendar, MapPin, Tag, RotateCcw, Search, X, Hash } from 'lucide-react';
import { Button } from '@/components/UI';
import { FilterAccordion } from './FilterAccordion';
import { TYPE_ICONS } from '@/components/Map/EventMarker';

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
    filters.search ||
    filters.postalCode ||
    filters.regions.length > 0 ||
    filters.types.length > 0 ||
    filters.dateFilter !== 'all';

  return (
    <div className="flex flex-col h-full">
      {/* Recherche intégrée */}
      <div className="p-4 border-b border-primary/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-primary/20 rounded-lg text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onUpdateFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtres en accordéon */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Filtre par date */}
        <FilterAccordion
          title="Date"
          icon={<Calendar className="w-4 h-4" />}
          defaultOpen={filters.dateFilter !== 'all'}
        >
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
        </FilterAccordion>

        {/* Filtre par type avec pictos */}
        <FilterAccordion
          title="Type d'événement"
          icon={<Tag className="w-4 h-4" />}
          defaultOpen={filters.types.length > 0}
          badge={filters.types.length}
        >
          <div className="space-y-2">
            {EVENT_TYPES.map((type) => {
              const Icon = TYPE_ICONS[type];
              const color = EVENT_TYPE_COLORS[type];
              return (
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
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {EVENT_TYPE_LABELS[type]}
                  </span>
                </label>
              );
            })}
          </div>
        </FilterAccordion>

        {/* Filtre par code postal */}
        <FilterAccordion
          title="Code postal"
          icon={<Hash className="w-4 h-4" />}
          defaultOpen={!!filters.postalCode}
        >
          <div className="relative">
            <input
              type="text"
              value={filters.postalCode}
              onChange={(e) => {
                // Permettre uniquement les chiffres
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                onUpdateFilters({ postalCode: value });
              }}
              placeholder="Ex: 75, 75001..."
              maxLength={5}
              className="w-full px-3 py-2 bg-white border border-primary/20 rounded-lg text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {filters.postalCode && (
              <button
                onClick={() => onUpdateFilters({ postalCode: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                aria-label="Effacer le code postal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Entrez un code postal ou son début (ex: 75 pour Paris)
          </p>
        </FilterAccordion>

        {/* Filtre par région */}
        <FilterAccordion
          title="Région"
          icon={<MapPin className="w-4 h-4" />}
          defaultOpen={filters.regions.length > 0}
          badge={filters.regions.length}
        >
          <div className="space-y-2">
            {/* Métropole */}
            <div className="space-y-2">
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
            </div>
            
            {/* DOM-TOM */}
            <div className="pt-3 mt-3 border-t border-primary/10">
              <p className="text-xs text-text-secondary mb-2 font-medium uppercase tracking-wide">Outre-mer</p>
              <div className="space-y-2">
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
        </FilterAccordion>
      </div>

      {/* Bouton réinitialiser */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-primary/10 bg-white">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
