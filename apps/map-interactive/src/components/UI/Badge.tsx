import { EventType, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '@/types/event';

interface BadgeProps {
  type: EventType;
  size?: 'sm' | 'md';
}

export function Badge({ type, size = 'md' }: BadgeProps) {
  const color = EVENT_TYPE_COLORS[type];
  const label = EVENT_TYPE_LABELS[type];
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
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
