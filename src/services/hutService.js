// hutService.js

import L from 'leaflet';
import store from '@/store';
import mapService from './mapService';

let hutsGeoJSON = null;

export default {
  renderHutsLayer(map) {
    const hutsLayer = store.getters['huts/hutsLayer'];
    if (hutsLayer) {
      hutsGeoJSON = L.geoJSON(hutsLayer, {
        pointToLayer: (feature, latlng) => {
          const shareLocation = feature.properties.ShareLocation;
          const iconUrl = shareLocation === 'Private' ? '/hut_white.svg' : '/hut_white.svg';
          const icon = L.icon({
            iconUrl,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -10],
          });

          const marker = L.marker(latlng, { icon, pane: 'interactive' });

          if (shareLocation === 'Private') {
            L.circleMarker(latlng, {
              radius: 15,
              fillColor: '#ff7800',
              color: '#ff7800',
              weight: 15,
              opacity: 0.1,
              fillOpacity: 0.3,
              pane: 'interactive',
            }).addTo(mapService.getInteractiveLayers());
          }

          return marker;
        },
        onEachFeature: (feature, layer) => {
          layer.on('click', () => {
            store.dispatch('selectedFeature/selectFeature', {
              type: 'hut',
              properties: feature.properties,
            });
            mapService.updateHighlightCircle(map, layer.getLatLng());
          });
        },
      });

      this.updateVisibility(map);
      map.on('zoomend', () => this.updateVisibility(map));

      console.log('Huts layer rendered');
    } else {
      console.warn('Huts layer not found in the store.');
    }
  },

  updateVisibility(map) {
    const zoom = map.getZoom();
    const interactiveLayers = mapService.getInteractiveLayers();

    if (zoom >= 9) {
      if (!interactiveLayers.hasLayer(hutsGeoJSON)) {
        interactiveLayers.addLayer(hutsGeoJSON);
      }
    } else {
      if (interactiveLayers.hasLayer(hutsGeoJSON)) {
        interactiveLayers.removeLayer(hutsGeoJSON);
      }
    }
  },

  removeLayer(map) {
    if (hutsGeoJSON) {
      mapService.getInteractiveLayers().removeLayer(hutsGeoJSON);
      map.off('zoomend', () => this.updateVisibility(map));
    }
  }
};