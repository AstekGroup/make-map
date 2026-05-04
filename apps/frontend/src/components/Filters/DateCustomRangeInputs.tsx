import type { EventFilters } from '@/hooks';

interface DateCustomRangeInputsProps {
  filters: EventFilters;
  onUpdateFilters: (f: Partial<EventFilters>) => void;
  /** Moins de marge (menu déroulant compact). */
  compact?: boolean;
}

export function DateCustomRangeInputs({
  filters,
  onUpdateFilters,
  compact = false,
}: DateCustomRangeInputsProps) {
  return (
    <div
      className={
        compact
          ? 'mt-2 pt-2 border-t border-primary/10 space-y-2'
          : 'mt-2 pt-3 border-t border-primary/10 space-y-2'
      }
    >
      <p className={compact ? 'text-[11px] text-text-secondary leading-snug' : 'text-xs text-text-secondary'}>
        Choisissez un jour (fin vide ou identique au début) ou une période (début → fin inclusifs).
      </p>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
            Début
          </span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => {
              const v = e.target.value;
              let nextTo = filters.dateTo;
              if (v && nextTo && nextTo < v) nextTo = v;
              onUpdateFilters({ dateFilter: 'custom', dateFrom: v, dateTo: nextTo });
            }}
            className="w-full rounded-md border border-primary/25 bg-white px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
            Fin (optionnel)
          </span>
          <input
            type="date"
            value={filters.dateTo || ''}
            min={filters.dateFrom || undefined}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                onUpdateFilters({ dateFilter: 'custom', dateTo: '' });
                return;
              }
              const from = filters.dateFrom;
              const safe = from && v < from ? from : v;
              onUpdateFilters({ dateFilter: 'custom', dateTo: safe });
            }}
            className="w-full rounded-md border border-primary/25 bg-white px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </label>
      </div>
    </div>
  );
}
