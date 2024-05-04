// src/services/trailforksService.js
import L from 'leaflet';
import '/node_modules/esri-leaflet/dist/esri-leaflet.js';
import '/node_modules/esri-leaflet-vector/dist/esri-leaflet-vector.js';
import store from '@/store';

let currentLayer = null;  // Store the current layer for later manipulation

export default {
  init(map) {
    // Subscribe to store changes and update the layer accordingly
    store.subscribe((mutation, state) => {
      if (mutation.type === 'trailforks/SET_TRAILFORKS_DATA') {
        this.renderTrailforksLayer(map);
      }
    });
  },

  renderTrailforksLayer(map) {
    // Clear the previous layer if it exists
    if (currentLayer) {
      map.removeLayer(currentLayer);
      currentLayer = null;
    }

    const trailforksData = store.getters['trailforks/trailforksData'];
    if (trailforksData) {
      currentLayer = L.geoJSON(trailforksData, {
        style: {
          color: '#66A28C',
          weight: 1,
          opacity: 1,
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(`Trail Name: ${feature.properties.name}<br>Difficulty: ${feature.properties.difficulty}`);
          }
        }
      }).addTo(map);
    } else {
      console.warn('Trailforks data not found in the store.');
    }
  },
};
