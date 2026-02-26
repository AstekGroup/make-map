import { EventType, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '@/types/event';

interface BadgeProps {
  type: EventType;
  size?: 'sm' | 'md';
  variant?: 'default' | 'highlight';
}

export function Badge({ type, size = 'md', variant = 'default' }: BadgeProps) {
  const color = EVENT_TYPE_COLORS[type];
  const label = EVENT_TYPE_LABELS[type];
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  // Style highlight : bleu marine sur fond jaune coquille d'oeuf
  if (variant === 'highlight') {
    return (
      <span
        className={`inline-flex items-center rounded-full font-semibold ${sizes[size]}`}
        style={{
          backgroundColor: '#ffeed0',
          color: '#003082',
        }}
      >
        {label}
      </span>
    );
  }
  
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizes[size]}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {label}
    </span>
  );
}
