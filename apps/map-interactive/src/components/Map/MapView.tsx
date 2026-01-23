import { useRef, useState, useCallback, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl, ScaleControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useMapViewport, useClusters } from '@/hooks';
import { EventsGeoJSON, Event, isCluster, MapFeature } from '@/types/event';
import { ClusterMarker } from './ClusterMarker';
import { EventMarker } from './EventMarker';
import { EventPopup } from './EventPopup';
import { MapStyleSelector, MAP_STYLES, type MapStyleId } from './MapStyleSelector';
import { ZoomIn, ZoomOut, Home } from 'lucide-react';

interface MapViewProps {
  geojson: EventsGeoJSON;
  selectedEvent: Event | null;
  onSelectEvent: (event: Event | null) => void;
  hoveredEvent: Event | null;
  onHoverEvent: (event: Event | null) => void;
}

export function MapView({
  geojson,
  selectedEvent,
  onSelectEvent,
  hoveredEvent,
  onHoverEvent,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const { viewport, onMove, flyTo, resetView, zoomIn, zoomOut } = useMapViewport();
  const [currentStyleId, setCurrentStyleId] = useState<MapStyleId>('bright');
  const [isStyleSelectorOpen, setIsStyleSelectorOpen] = useState(false);
  const [bounds, setBounds] = useState<{
    west: number;
    south: number;
    east: number;
    north: number;
  } | null>(null);

  // Initialisation de la carte
  const onMapLoad = useCallback(() => {
    // Mise à jour des bounds initiale
    onMoveEnd();
  }, []);

  // Mise à jour des bounds
  const onMoveEnd = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      const b = map.getBounds();
      if (b) {
        setBounds({
          west: b.getWest(),
          south: b.getSouth(),
          east: b.getEast(),
          north: b.getNorth(),
        });
      }
    }
  }, []);

  // Clustering
  const { clusters, getClusterExpansionZoom } = useClusters(
    geojson,
    bounds,
    viewport.zoom
  );

  // Gestionnaire de clic sur cluster
  const handleClusterClick = useCallback(
    (clusterId: number, longitude: number, latitude: number) => {
      const expansionZoom = getClusterExpansionZoom(clusterId);
      flyTo(longitude, latitude, expansionZoom);
    },
    [getClusterExpansionZoom, flyTo]
  );

  // Gestionnaire de clic sur événement
  const handleEventClick = useCallback(
    (feature: MapFeature) => {
      if (!isCluster(feature)) {
        onSelectEvent(feature.properties);
        flyTo(
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
          Math.max(viewport.zoom, 12)
        );
      }
    },
    [onSelectEvent, flyTo, viewport.zoom]
  );

  // Position du popup
  const popupCoordinates = useMemo(() => {
    if (!selectedEvent) return null;
    return {
      longitude: selectedEvent.longitude,
      latitude: selectedEvent.latitude,
    };
  }, [selectedEvent]);

  // URL du style de carte actuel
  const currentStyleUrl = useMemo(() => {
    const style = MAP_STYLES.find((s) => s.id === currentStyleId);
    return style?.url || MAP_STYLES[0].url;
  }, [currentStyleId]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewport}
        onMove={onMove}
        onMoveEnd={onMoveEnd}
        onLoad={onMapLoad}
        mapStyle={currentStyleUrl}
        style={{ width: '100%', height: '100%' }}
        minZoom={3}
        maxZoom={18}
        attributionControl={false}
      >
        {/* Contrôles natifs */}
        <NavigationControl position="bottom-right" showCompass={false} />
        <GeolocateControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {/* Clusters et marqueurs */}
        {clusters.map((feature) => {
          const [longitude, latitude] = feature.geometry.coordinates;
          
          if (isCluster(feature)) {
            return (
              <Marker
                key={`cluster-${feature.id}`}
                longitude={longitude}
                latitude={latitude}
              >
                <ClusterMarker
                  count={feature.properties.point_count}
                  onClick={() =>
                    handleClusterClick(feature.properties.cluster_id, longitude, latitude)
                  }
                />
              </Marker>
            );
          }

          const event = feature.properties;
          const isSelected = selectedEvent?.id === event.id;
          const isHovered = hoveredEvent?.id === event.id;

          return (
            <Marker
              key={`event-${event.id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <EventMarker
                type={event.type}
                isSelected={isSelected || isHovered}
                onClick={() => handleEventClick(feature)}
                onMouseEnter={() => onHoverEvent(event)}
                onMouseLeave={() => onHoverEvent(null)}
              />
            </Marker>
          );
        })}

        {/* Popup */}
        {selectedEvent && popupCoordinates && (
          <Popup
            longitude={popupCoordinates.longitude}
            latitude={popupCoordinates.latitude}
            anchor="bottom"
            onClose={() => onSelectEvent(null)}
            closeButton={false}
            closeOnClick={false}
            offset={20}
          >
            <EventPopup event={selectedEvent} onClose={() => onSelectEvent(null)} />
          </Popup>
        )}
      </Map>

      {/* Contrôles personnalisés */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-card flex items-center justify-center text-primary hover:bg-surface-beige transition-colors"
          aria-label="Zoomer"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={zoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-card flex items-center justify-center text-primary hover:bg-surface-beige transition-colors"
          aria-label="Dézoomer"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 bg-white rounded-lg shadow-card flex items-center justify-center text-primary hover:bg-surface-beige transition-colors"
          aria-label="Recentrer la carte"
        >
          <Home className="w-5 h-5" />
        </button>
        <MapStyleSelector
          currentStyle={currentStyleId}
          onStyleChange={setCurrentStyleId}
          isOpen={isStyleSelectorOpen}
          onToggle={() => setIsStyleSelectorOpen(!isStyleSelectorOpen)}
        />
      </div>

      {/* Indicateur de zoom */}
      <div className="absolute bottom-20 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-card text-sm font-medium text-primary">
        Zoom: {viewport.zoom.toFixed(1)}
      </div>
    </div>
  );
}
