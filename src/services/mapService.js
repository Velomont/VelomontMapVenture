// layerService.addVectorTileBasemap(map, '171f1f780e8d43fcbd0d3ef4f2e71ab2'); // Basemap ID
// layerService.addVectorTileLabels(map, '65605d0db3bd4067ad4805a81a4689b8'); // Labels ID

import L from 'leaflet';
import 'esri-leaflet';
import 'esri-leaflet-vector';
import store from '@/store';
import { createApp } from 'vue';
import HutPopup from '@/components/HutPopup.vue';
import TrailPopup from '@/components/TrailPopup.vue';
import layerService from './layerService';

const highlightStyle = {
  color: '#EC892D',  // Highlight trail color
  weight: 7,
  opacity: 1,
  lineCap: 'butt',
  lineJoin: 'round'
};

function getTrailStyle(feature) {
  switch (feature.properties.TrailType) {
    case 'Single Track':
      return {
        color: '#475945',
        weight: 2,
        opacity: 1,
        lineCap: 'butt',
        lineJoin: 'round'
      };
    case 'Double Track':
      return {
        color: '#538843',
        weight: 4,
        opacity: 1,
        lineCap: 'butt',
        lineJoin: 'round'
      };
    case 'Road':
      return {
        color: '#474747',
        weight: 4,
        opacity: 1,
        lineCap: 'butt',
        lineJoin: 'round'
      };
    default:
      return {
        color: '#165b83',
        weight: 3,
        opacity: 1,
        lineCap: 'butt',
        lineJoin: 'round'
  
      };
  }
}

let currentHighlightedFeature = null;

export default {
  initMap() {
    const map = L.map('map', {
      center: [44.5, -72.25],
      zoom: 8,
      minZoom: 8,
      maxZoom: 14,
      maxBounds: [[42.5, -74.5], [45.25, -71.0]],
      maxBoundsViscosity: 1.0
    });
    map.zoomControl.remove();

    layerService.addVermontMaskLayer(map);
    const apiKey = 'AAPK94098c216903482990ac828c02e90fc5IDLx9lADJDcBVDokCzo74gYufQBjxYLysLpRCxTDT4-7FH34KkHdDSZdQl_A35_p';
    const basemapEnum = "1a1608d43ed04e4e9a9b08f7cf617454";
    L.esri.Vector.vectorBasemapLayer(basemapEnum, { apiKey: apiKey }).addTo(map);

    return map;
  },

  renderTrailLayer(map) {
    const trailLayer = store.getters['trails/trailLayer'];
    if (trailLayer) {
      L.geoJSON(trailLayer, {
        style: getTrailStyle,
        onEachFeature: (feature, layer) => {
          layer.on('click', function() {
            if (currentHighlightedFeature) {
              currentHighlightedFeature.setStyle(getTrailStyle(currentHighlightedFeature.feature));
            }
            currentHighlightedFeature = layer;
            layer.setStyle(highlightStyle);

            const popupContent = document.createElement('div');
            const app = createApp(TrailPopup, {
              trailType: feature.properties.TrailType,
              trailName: feature.properties.TrailName,
              trailManager: feature.properties.TrailManager,
              phase: feature.properties.Phase,
              difficultyRating: feature.properties.DifficultyRating,
              constructionStatus: feature.properties.ConstructionStatus,
              miles: feature.properties.Miles,
            });
            app.mount(popupContent);
            layer.bindPopup(popupContent, { minWidth: 200 }).openPopup();
          });
        }
      }).addTo(map);

      map.on('popupclose', function() {
        if (currentHighlightedFeature) {
          currentHighlightedFeature.setStyle(getTrailStyle(currentHighlightedFeature.feature));
          currentHighlightedFeature = null;
        }
      });
    } else {
      console.warn('Trail layer not found in the store.');
    }
  },
  
  renderHutsLayer(map) {
    const hutsLayer = store.getters['huts/hutsLayer'];

    if (hutsLayer) {
      L.geoJSON(hutsLayer, {
        pointToLayer: (feature, latlng) => {
          const shareLocation = feature.properties.ShareLocation;

          if (shareLocation === 'Private') {
            // Define the circle marker for private huts
            const circle = L.circleMarker(latlng, {
              radius: (zoom) => {
                // Adjust the radius based on the zoom level
                return zoom * 8;
              },
              fillColor: '#ff7800',
              color: '#ff7800',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.6
            }).addTo(map); // Add the circle to the map

            // Define an icon to go on top of the circle
            const icon = L.divIcon({
              className: 'custom-hut-icon private-hut-icon',
              html: '<span class="material-symbols-sharp">home</span>', // Replace 'home' with your private icon
              iconSize: [20, 20], // Smaller icon size to fit within the circle
              iconAnchor: [10, 10], // Centering the icon on the circle
              popupAnchor: [0, -10] // Adjust the popup anchor if needed
            });

            // Create a marker with the icon and add it on top of the circle
            return L.marker(latlng, { icon: icon });
          } else {
            // Use a custom icon for public huts
            const icon = L.divIcon({
              className: 'custom-hut-icon public-hut-icon',
              html: '<span class="material-symbols-sharp">public</span>',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            return L.marker(latlng, { icon: icon });
          }
        },
        onEachFeature: (feature, layer) => {
          const { Name, HutPartner, URL } = feature.properties;
          const popupContent = document.createElement('div');
          const app = createApp(HutPopup, {
            name: Name,
            partner: HutPartner,
            popupInfo: URL,
            URL: URL,
          });
          app.mount(popupContent);
          layer.bindPopup(popupContent, { minWidth: 200 });
        },
      }).addTo(map);
    } else {
      console.warn('Huts layer not found in the store.');
    }
  },
};
