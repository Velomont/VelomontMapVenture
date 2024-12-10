// businessService.js

import L from 'leaflet';
import store from '@/store';
import mapService from './mapService';

let businessLayer;

export default {
  renderBusinessLayer(map, visible = true) {
    if (!store.state.businesses) {
      console.error("Businesses module is not available in the store");
      return;
    }

    const businesses = store.getters['businesses/allBusinesses'];
    if (!businesses || businesses.length === 0) {
      console.warn('Business layer not found in the store.');
      return;
    }

    if (businessLayer) {
      mapService.getInteractiveLayers().removeLayer(businessLayer);
    }

    businessLayer = L.layerGroup();

    if (visible) {
      businesses.forEach((business) => {
        let iconUrl;
        switch (business.Category) {
          case 'Retailers Alliance':
            iconUrl = '/icons/retailers.svg';
            break;
          case 'Eat- Drink-Shop Local':
            iconUrl = '/icons/eat.svg';
            break;
          case 'Fitness and Wellness':
            iconUrl = '/icons/wellness.svg';
            break;
          case 'Lodging':
            iconUrl = '/icons/lodging.svg';
            break;
          case 'DH ':
            iconUrl = '/icons/dh.svg';
            break;
          default:
            iconUrl = '/icons/default.svg';
            break;
        }

        const icon = L.icon({
          iconUrl,
          iconSize: [18, 18],
        });
        const marker = L.marker([business.Latitude, business.Longitude], { icon, pane: 'interactive' });
        marker.on('click', () => {
          store.dispatch('selectedFeature/selectFeature', {
            type: 'business',
            properties: business,
          });
          mapService.updateHighlightCircle(map, marker.getLatLng());
        });
        businessLayer.addLayer(marker);
      });

      mapService.getInteractiveLayers().addLayer(businessLayer);
      console.log('Business layer rendered');
    }
  },

  updateBusinessLayer(map, visible = true) {
    if (businessLayer) {
      mapService.getInteractiveLayers().removeLayer(businessLayer);
    }
    this.renderBusinessLayer(map, visible);
  },
};
