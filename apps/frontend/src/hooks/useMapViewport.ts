import { useState, useCallback } from 'react';
import type { ViewState } from 'react-map-gl';

// Centre de la France métropolitaine
const FRANCE_CENTER = {
  longitude: 2.2137,
  latitude: 46.2276,
};

const INITIAL_ZOOM = 5.5;

export interface MapViewport extends ViewState {
  width?: number;
  height?: number;
}

export function useMapViewport() {
  const [viewport, setViewport] = useState<MapViewport>({
    longitude: FRANCE_CENTER.longitude,
    latitude: FRANCE_CENTER.latitude,
    zoom: INITIAL_ZOOM,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const onMove = useCallback((evt: { viewState: ViewState }) => {
    setViewport(evt.viewState);
  }, []);

  const flyTo = useCallback((
    longitude: number,
    latitude: number,
    zoom?: number
  ) => {
    setViewport(prev => ({
      ...prev,
      longitude,
      latitude,
      zoom: zoom ?? prev.zoom,
    }));
  }, []);

  const resetView = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      longitude: FRANCE_CENTER.longitude,
      latitude: FRANCE_CENTER.latitude,
      zoom: INITIAL_ZOOM,
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, 18),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 3),
    }));
  }, []);

  return {
    viewport,
    setViewport,
    onMove,
    flyTo,
    resetView,
    zoomIn,
    zoomOut,
  };
}
