import { memo } from 'react';
import { MapPin, Coffee, Wrench, Mic2, Gamepad2, HelpCircle } from 'lucide-react';
import { EventType, EVENT_TYPE_COLORS } from '@/types/event';

interface EventMarkerProps {
  type: EventType;
  isSelected?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TYPE_ICONS: Record<EventType, typeof MapPin> = {
  'cafe-ia': Coffee,
  'atelier': Wrench,
  'conference': Mic2,
  'jeu': Gamepad2,
  'autre': HelpCircle,
};

function EventMarkerComponent({
  type,
  isSelected = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: EventMarkerProps) {
  const Icon = TYPE_ICONS[type];
  const color = EVENT_TYPE_COLORS[type];
  
  return (
    <div
      className={`event-marker animate-scale-in ${isSelected ? 'ring-2 ring-white scale-125' : ''}`}
      style={{
        backgroundColor: color,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label="Voir les détails de l'événement"
    >
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}

export const EventMarker = memo(EventMarkerComponent);
