import L from 'leaflet';
import 'esri-leaflet';
import 'esri-leaflet-vector';
import store from '@/store';

let currentLayer = null;  // Store the current layer for later manipulation

const highlightStyle = {
  color: '#EC892D',
  weight: 7,
  opacity: 1,
  lineCap: 'butt',
  lineJoin: 'round',
};

function getTrailStyle(feature) {
  return {
    color: '#66A28C',
    weight: 1,
    opacity: 1,
  };
}

export default {
  init(map) {
    // Subscribe to store changes and update the layer accordingly
    store.subscribe((mutation, state) => {
      if (mutation.type === 'trailforks/SET_TRAILFORKS_DATA') {
        console.log('Trailforks data changed:', state.trailforks.trailforksData);
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
        style: getTrailStyle,
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.trailid) {
            layer.bindPopup(`Trail ID: ${feature.properties.trailid}<br>Activity Type: ${feature.properties.activitytype}`);
          }
        }
      }).addTo(map);
      console.log('Trailforks layer rendered');
    } else {
      console.warn('Trailforks data not found in the store.');
    }
  },

  updateHighlightCircle(map, latlng) {
    if (this.highlightCircle) {
      map.removeLayer(this.highlightCircle);
    }
    if (latlng) {
      this.highlightCircle = L.circleMarker(latlng, {
        radius: 20,
        color: '#EC892D',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7,
        className: 'pulsating-opacity',
      }).addTo(map);
    }
  },
};
