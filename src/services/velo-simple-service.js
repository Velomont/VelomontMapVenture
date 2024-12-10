  import L from 'leaflet';
  import store from '@/store';
  import mapService from './mapService';

  const statusStyles = {
    Complete: { color: '#00FF00', dashArray: '10 0' },
    Disconnected: { color: '#FFA500', dashArray: '5 5' },
    Pending: { color: '#FFFF00', dashArray: '15 10 5 10' },
    Conceptual: { color: '#FF0000', dashArray: '1 5' }
  };

  export default {
    renderVeloSimpleLayer(map) {
      const veloSimpleLayer = store.getters['veloSimple/veloSimpleLayer'];
      if (veloSimpleLayer) {
        const veloSimpleGeoJSON = L.geoJSON(veloSimpleLayer, {
          style: this.styleFeature,
          onEachFeature: this.onEachFeature
        });
        mapService.getInteractiveLayers().addLayer(veloSimpleGeoJSON);
        console.log('Velo Simple layer rendered');
      } else {
        console.warn('Velo Simple layer not found in the store.');
      }
    },

    styleFeature(feature) {
      const status = feature.properties.Status;
      return statusStyles[status] || { color: '#808080', dashArray: '' };
    },

    onEachFeature(feature, layer) {
      const popupContent = `
        <h3>${feature.properties.Segment}</h3>
        <p><strong>Status:</strong> ${feature.properties.Status}</p>
        <p>${feature.properties.Description}</p>
      `;
      layer.bindPopup(popupContent);

      layer.on('click', () => {
        store.dispatch('selectedFeature/selectFeature', {
          type: 'veloSimple',
          properties: feature.properties,
        });
      });
    },
    
  createLegend() {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = '<h4>Velomont Trail Status</h4>';

      for (const status in statusStyles) {
        div.innerHTML += `
          <div>
            <i style="background: ${statusStyles[status].color}; border: 1px solid #000; display: inline-block; width: 20px; height: 2px; margin-right: 5px;"></i>
            ${status}
          </div>
        `;
      }

      return div;
    };

    return legend;
  }
};
