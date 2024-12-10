// poiService.js

import L from 'leaflet';
import store from '@/store';
import mapService from './mapService';

export default {
  renderPOILayers(map) {
    const createLayer = (data, color, popupContent) => {
      return L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(popupContent(feature.properties));
        }
      });
    };

    const parkingLayer = createLayer(
      store.getters['poi/parkingData'],
      "#ff7800",
      props => `<h3>Parking: ${props.title || 'N/A'}</h3>`
    );

    const campingLayer = createLayer(
      store.getters['poi/campingData'],
      "#00ff00",
      props => `<h3>Camping: ${props.title || 'N/A'}</h3>`
    );

    const placesLayer = createLayer(
      store.getters['poi/filteredPlacesData'],
      "#0078ff",
      props => `
        <h3>${props.SITE_NAME || 'N/A'}</h3>
        <p>Type: ${props.TYPE || 'N/A'}</p>
        <p>Camping: ${props.CAMP === 'Y' ? 'Yes' : 'No'}</p>
        ${props.N_PARKSUM > 0 ? `<p>Parking: ${props.N_PARKSUM} spots</p>` : ''}
        <p>Organization: ${props.ORGANIZ || 'N/A'}</p>
      `
    );

    return { parkingLayer, campingLayer, placesLayer };
  },

  updatePOILayers(map) {
    const interactiveLayers = mapService.getInteractiveLayers();
    if (this.poiLayers) {
      Object.values(this.poiLayers).forEach(layer => interactiveLayers.removeLayer(layer));
    }
    this.poiLayers = this.renderPOILayers(map);
    Object.values(this.poiLayers).forEach(layer => interactiveLayers.addLayer(layer));
  },
};
