

import L from 'leaflet';
import '/node_modules/esri-leaflet/dist/esri-leaflet.js';
import '/node_modules/esri-leaflet-vector/dist/esri-leaflet-vector.js';

  import store from '@/store';
  import { createApp } from 'vue';
  import HutPopup from '@/components/HutPopup.vue';
  import TrailPopup from '@/components/TrailPopup.vue';
  import layerService from './layerService'; // Corrected file name

  export default {
   initMap() {
      const map = L.map('map', { center: [44.5, -72.5], zoom: 8 });
      map.zoomControl.remove();

      // Add vector tile basemap and labels
      // Ensure these functions are correctly implemented in layerServices.js
      layerService.addVectorTileBasemap(map, '4c58173b0ebb4c11b09f021e6e4cbe08'); // Basemap ID
      layerService.addVectorTileLabels(map, '65605d0db3bd4067ad4805a81a4689b8'); // Labels ID

      layerService.addVermontMaskLayer(map);

    //  layerService.addCorridorMaskLayer(map);

      return map;
   },

    renderTrailLayer(map) {
      const trailLayer = store.getters['trails/trailLayer'];
      if (trailLayer) {
        const filteredTrails = store.getters['trails/filteredTrails'];
        L.geoJSON(filteredTrails, {
          style: feature => ({
            color: '#165b83',
            weight: 3,
            opacity: 0.7,
          }),
          onEachFeature: (feature, layer) => {
            const { TrailType, TrailName, TrailManager, Phase, DifficultyRating,     ConstructionStatus, Miles } = feature.properties;
            const popupContent = document.createElement('div');
            const app = createApp(TrailPopup, {
              trailType: TrailType,
              trailName: TrailName,
              trailManager: TrailManager,
              phase: Phase,
              difficultyRating: DifficultyRating,
              constructionStatus: ConstructionStatus,
              miles: Miles,
            });
            app.mount(popupContent);
            layer.bindPopup(popupContent, { minWidth: 200 });
          },
        }).addTo(map);
      } else {
        console.warn('Trail layer not found in the store.');
      }
    },

    openTrailPopup(map, trail) {
      const [lng, lat] = trail.geometry.coordinates[0];
      map.setView([lat, lng], 14);

      const { TrailType, TrailName, TrailManager, Phase, DifficultyRating, ConstructionStatus, Miles } = trail.properties;
      const popupContent = document.createElement('div');
      const app = createApp(TrailPopup, {
        trailType: TrailType,
        trailName: TrailName,
        trailManager: TrailManager,
        phase: Phase,
        difficultyRating: DifficultyRating,
        constructionStatus: ConstructionStatus,
        miles: Miles,
      });
      app.mount(popupContent);

      L.popup({ minWidth: 200 })
        .setLatLng([lat, lng])
        .setContent(popupContent)
        .openOn(map);
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