import { memo } from 'react';
import { Event } from '@/types/event';
import { Badge } from '@/components/UI';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function EventCardComponent({
  event,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div
      className={`p-4 rounded-card bg-white border-2 cursor-pointer card-hover transition-all duration-200 ${
        isSelected
          ? 'border-accent-coral shadow-popup'
          : isHovered
          ? 'border-primary/30 shadow-card'
          : 'border-transparent shadow-card hover:border-primary/20'
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="flex items-start gap-3">
        {/* Indicateur type */}
        <div className="flex-shrink-0 mt-0.5">
          <Badge type={event.type} size="sm" />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <h4 className="font-rubik font-semibold text-text-primary text-sm leading-tight line-clamp-2">
            {event.title}
          </h4>

          <div className="mt-2 space-y-1">
            {/* Date et heure */}
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-accent-coral" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-accent-coral" />
                {event.time}
              </span>
            </div>

            {/* Lieu */}
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-accent-coral flex-shrink-0" />
              <span className="truncate">{event.city}</span>
            </div>
          </div>

          {/* Badge semaine IA */}
          {event.isDuringWeek && (
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-accent-coral font-medium">
              <span className="w-1.5 h-1.5 bg-accent-coral rounded-full animate-pulse-soft" />
              Semaine de l'IA
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const EventCard = memo(EventCardComponent);
