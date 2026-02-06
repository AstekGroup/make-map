import { memo } from 'react';

interface ClusterMarkerProps {
  count: number;
  onClick: () => void;
  size?: 'sm' | 'md';
}

function getClusterSize(count: number, sizeVariant: 'sm' | 'md'): number {
  if (sizeVariant === 'sm') {
    if (count < 10) return 20;
    if (count < 50) return 24;
    return 28;
  }
  if (count < 10) return 36;
  if (count < 50) return 44;
  if (count < 100) return 52;
  if (count < 500) return 60;
  return 68;
}

function ClusterMarkerComponent({ count, onClick, size = 'md' }: ClusterMarkerProps) {
  const markerSize = getClusterSize(count, size);
  const isSmall = size === 'sm';
  
  return (
    <div
      className="cluster-marker animate-scale-in"
      style={{
        width: markerSize,
        height: markerSize,
        fontSize: isSmall ? '9px' : count >= 1000 ? '12px' : count >= 100 ? '14px' : '16px',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Cluster de ${count} événements. Cliquez pour zoomer.`}
    >
      {count >= 1000 ? `${Math.round(count / 100) / 10}k` : count}
    </div>
  );
}

export const ClusterMarker = memo(ClusterMarkerComponent);
