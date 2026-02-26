import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import Map, { Marker, Popup, ScaleControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useMapViewport, useClusters } from '@/hooks';
import { EventsGeoJSON, Event, isCluster, MapFeature } from '@/types/event';
import { ClusterMarker } from './ClusterMarker';
import { EventMarker } from './EventMarker';
import { EventPopup } from './EventPopup';
import { MAP_STYLES } from './MapStyleSelector';
import { DOMTOMInset } from './DOMTOMInset';
import { ZoomIn, ZoomOut, Home } from 'lucide-react';

interface MapViewProps {
  geojson: EventsGeoJSON;
  selectedEvent: Event | null;
  onSelectEvent: (event: Event | null) => void;
  hoveredEvent: Event | null;
  onHoverEvent: (event: Event | null) => void;
  onViewEventDetails?: (eventId: string) => void;
  onMapFlyToReady?: (flyTo: (lng: number, lat: number, zoom?: number) => void) => void;
}

export function MapView({
  geojson,
  selectedEvent,
  onSelectEvent,
  hoveredEvent,
  onHoverEvent,
  onViewEventDetails,
  onMapFlyToReady,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const { viewport, onMove } = useMapViewport();
  const [bounds, setBounds] = useState<{
    west: number;
    south: number;
    east: number;
    north: number;
  } | null>(null);

  // Use Liberty (3D) style by default (no style selector anymore)
  const currentStyleUrl = MAP_STYLES.find(s => s.id === 'liberty')?.url || MAP_STYLES[0].url;

  // Expose flyTo to parent via mapRef for smoother transitions
  const smoothFlyTo = useCallback((lng: number, lat: number, zoom?: number) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: [lng, lat],
        zoom: zoom ?? map.getZoom(),
        duration: 1200,
        essential: true,
      });
    }
  }, []);

  // Expose flyTo to parent
  useEffect(() => {
    if (onMapFlyToReady) {
      onMapFlyToReady(smoothFlyTo);
    }
  }, [onMapFlyToReady, smoothFlyTo]);

  // Initialisation de la carte
  const onMapLoad = useCallback(() => {
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
      smoothFlyTo(longitude, latitude, expansionZoom);
    },
    [getClusterExpansionZoom, smoothFlyTo]
  );

  // Gestionnaire de clic sur événement
  const handleEventClick = useCallback(
    (feature: MapFeature) => {
      if (!isCluster(feature)) {
        const event = feature.properties;
        onSelectEvent(event);
        // Smooth fly to the event, offset slightly to center popup in view
        smoothFlyTo(
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
          Math.max(viewport.zoom, 12)
        );
      }
    },
    [onSelectEvent, smoothFlyTo, viewport.zoom]
  );

  // Position du popup with offset to avoid being hidden by top controls
  const popupCoordinates = useMemo(() => {
    if (!selectedEvent) return null;
    return {
      longitude: selectedEvent.longitude,
      latitude: selectedEvent.latitude,
    };
  }, [selectedEvent]);

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
            offset={25}
            maxWidth="340px"
          >
            <EventPopup 
              event={selectedEvent} 
              onClose={() => onSelectEvent(null)} 
              onViewDetails={onViewEventDetails}
            />
          </Popup>
        )}
      </Map>

      {/* Contrôles carte - zoom et recentrage */}
      <div className="absolute top-20 right-4 flex flex-col gap-2">
        <button
          onClick={() => {
            const map = mapRef.current;
            if (map) {
              const currentZoom = map.getZoom();
              map.flyTo({ zoom: Math.min(currentZoom + 1, 18), duration: 300 });
            }
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-card flex items-center justify-center text-primary hover:bg-surface-beige transition-colors"
          aria-label="Zoomer"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const map = mapRef.current;
            if (map) {
              const currentZoom = map.getZoom();
              map.flyTo({ zoom: Math.max(currentZoom - 1, 3), duration: 300 });
            }
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-card flex items-center justify-center text-primary hover:bg-surface-beige transition-colors"
          aria-label="Dézoomer"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const map = mapRef.current;
            if (map) {
              map.flyTo({
                center: [2.2137, 46.2276],
                zoom: 5.5,
                duration: 1200,
              });
            }
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-card flex items-center justify-center text-primary hover:bg-surface-beige transition-colors"
          aria-label="Recentrer la carte"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* Mini-cartes DOM/TOM + France métropolitaine */}
      <DOMTOMInset
        geojson={geojson}
        mapStyleUrl={currentStyleUrl}
        onEventClick={(eventId) => {
          const event = geojson.features.find(f => f.properties.id === eventId);
          if (event) {
            onSelectEvent(event.properties);
            smoothFlyTo(event.properties.longitude, event.properties.latitude, 14);
          }
        }}
        onTerritoryClick={(territory) => {
          smoothFlyTo(territory.center.lng, territory.center.lat, territory.zoom);
        }}
      />
    </div>
  );
}
