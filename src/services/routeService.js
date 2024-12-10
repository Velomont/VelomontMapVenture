// routeService.js

import L from 'leaflet';
import store from '@/store';
import mapService from './mapService';

const highlightStyle = {
  color: '#EC892D',
  weight: 7,
  opacity: 1,
  lineCap: 'butt',
  lineJoin: 'round',
};

function getTrailStyle(feature) {
  switch (feature.properties.TrailType) {
    case 'Single Track':
      return {
        color: '#475945',
        weight: 2,
        opacity: 1,
        lineCap: 'butt',
        lineJoin: 'round',
      };
    case 'Double Track':
      return {
        color: '#538843',
        weight: 4,
        opacity: 1,
        lineCap: 'butt',
        lineJoin: 'round',
      };
    case 'Road':
      return {
        color: '#474747',
        weight: 4,
        opacity: 1,
        lineCap: 'butt',
        lineJoin: 'round',
      };
    default:
      return {
        color: '#165b83',
        weight: 3,
        opacity: 1,
        lineCap: 'butt',
        lineJoin: 'round',
      };
  }
}

let currentHighlightedFeature = null;

export default {
  renderRouteLayer(map) {
    const routeLayer = store.getters['route/routeData'];
    if (routeLayer) {
      const layer = L.geoJSON(routeLayer, {
        style: getTrailStyle,
        pane: 'interactive',
        onEachFeature: (feature, layer) => {
          layer.on('click', () => {
            if (currentHighlightedFeature) {
              currentHighlightedFeature.setStyle(getTrailStyle(currentHighlightedFeature.feature));
            }
            currentHighlightedFeature = layer;
            layer.setStyle(highlightStyle);

            store.dispatch('selectedFeature/selectFeature', {
              type: 'route',
              properties: feature.properties,
            });
            mapService.updateHighlightCircle(map, layer.getBounds().getCenter());
          });
        },
      });
      mapService.getInteractiveLayers().addLayer(layer);
      console.log('Route layer added to interactive layers');
    } else {
      console.warn('Route layer not found in the store.');
    }
  },

  renderTrailPopup(map) {
    const trailsData = store.getters['route/trailsData'];
    if (trailsData && trailsData.length > 0) {
      const trailsLayer = L.layerGroup();
      trailsData.forEach(trail => {
        const latLngs = trail.track.latitude.split(',').map((lat, idx) => [
          parseFloat(trail.track.longitude.split(',')[idx]),
          parseFloat(lat),
        ]);

        const trailLayer = L.geoJSON({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: latLngs,
          },
          properties: {
            name: trail.title,
            difficulty: trail.difficulty,
            type: trail.trailtype,
            status: trail.status,
          },
        }, {
          style: getTrailStyle,
          pane: 'interactive',
        });

        trailLayer.on('click', () => {
          store.dispatch('selectedFeature/selectFeature', {
            type: 'trail',
            properties: {
              trailType: trail.trailtype,
              trailName: trail.title,
              difficultyRating: trail.difficulty,
              miles: trail.length / 1609.34, // converting meters to miles
            },
          });
        });

        trailsLayer.addLayer(trailLayer);
      });

      mapService.getInteractiveLayers().addLayer(trailsLayer);
      console.log('Trail popups rendered');
    } else {
      console.warn('No trail data found to render popups.');
    }
  },
};
