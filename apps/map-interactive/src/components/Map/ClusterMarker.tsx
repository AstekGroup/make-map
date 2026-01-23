import { memo } from 'react';

interface ClusterMarkerProps {
  count: number;
  onClick: () => void;
}

function getClusterSize(count: number): number {
  if (count < 10) return 36;
  if (count < 50) return 44;
  if (count < 100) return 52;
  if (count < 500) return 60;
  return 68;
}

function ClusterMarkerComponent({ count, onClick }: ClusterMarkerProps) {
  const size = getClusterSize(count);
  
  return (
    <div
      className="cluster-marker animate-scale-in"
      style={{
        width: size,
        height: size,
        fontSize: count >= 1000 ? '12px' : count >= 100 ? '14px' : '16px',
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
