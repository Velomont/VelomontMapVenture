// src/services/layerServices.js

import L from 'leaflet';
import '/node_modules/esri-leaflet/dist/esri-leaflet.js';
import '/node_modules/esri-leaflet-vector/dist/esri-leaflet-vector.js';

const apiKey = 'AAPK94098c216903482990ac828c02e90fc5IDLx9lADJDcBVDokCzo74gYufQBjxYLysLpRCxTDT4-7FH34KkHdDSZdQl_A35_p';

const corridorMaskUrl = 'https://services8.arcgis.com/YKIZLV97YLZN6bol/ArcGIS/rest/services/VelomontCorridorMask/FeatureServer/10';

const initialZoomLevel = 8;  
const initialBlur = 0;    
const initialOpacity = 0.3;


export default {
  // Function to add the vector tile basemap
  addVectorTileBasemap(map, itemId) {
    if (L.esri && L.esri.Vector) {
      L.esri.Vector.vectorBasemapLayer(itemId, {
        apiKey: apiKey // Pass the API key [1]
      }).addTo(map);
    } else {
      console.error('Esri Leaflet Vector library is not loaded.');
    }
  },

  // Function to add the vector tile labels
addVectorTileLabels(map, itemId) {
    if (L.esri && L.esri.Vector) {
      if (!map.getPane('labels')) {
        map.createPane('labels');
        map.getPane('labels').style.zIndex = 650;
        map.getPane('labels').style.pointerEvents = 'none'; // Ensures the pane doesn't interfere with map interaction
      }

      let labelsLayer = L.esri.Vector.vectorBasemapLayer(itemId, {
        apiKey: apiKey, // Pass the API key
        pane: 'labels', // Specify the custom pane for the labels
        style: (style) => {
          const newStyle = {...style};
          newStyle.layers = newStyle.layers.filter(layer => layer.id.includes('label') || layer.type === 'symbol');
          return newStyle;
        }
      });

      function updateLabelsVisibility() {
        const zoom = map.getZoom();
        if (zoom >= 15) {
          if (!map.hasLayer(labelsLayer)) {
            labelsLayer.addTo(map);
          }
        } else {
          if (map.hasLayer(labelsLayer)) {
            map.removeLayer(labelsLayer);
          }
        }
      }

      // Initial check to add/remove labels based on initial zoom
      updateLabelsVisibility();

      // Add an event listener to control label visibility based on zoom level
      map.on('zoomend', updateLabelsVisibility);
    } else {
      console.error('Esri Leaflet Vector library is not loaded.');
    }
  },
  // Function to add corridor mask layer using a feature layer

   addCorridorMaskLayer(map) {
      if (L.esri) {
        map.createPane('corridorMask');
        map.getPane('corridorMask').style.zIndex = 450;

        const corridorLayer = L.esri.featureLayer({
          url: corridorMaskUrl,
          token: apiKey,
          pane: 'corridorMask',
          style: () => ({
            color: '#538843',
            weight: 1,
            opacity: 0.5,  // Initial opacity
            fillOpacity: 0.5  // Initial fill opacity
          })
        }).addTo(map);

        map.on('zoomend', () => {
          let updatedStyles = this.calculateStyles(map.getZoom());
          corridorLayer.setStyle({
            opacity: updatedStyles.opacity,
            fillOpacity: updatedStyles.fillOpacity
          });

          const pane = map.getPane('corridorMask');
          if (pane) {
            console.log("Applying blur:", updatedStyles.blur);  // Debugging the blur value
            pane.style.filter = `blur(${updatedStyles.blur})`;
          }
        });
      } else {
        console.error('Esri Leaflet library is not loaded.');
      }
    },
  calculateStyles(zoomLevel) {
      let blurIntensity = "0px", opacity = 0.5, fillOpacity = 0.5; // Default values
      switch (zoomLevel) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
              blurIntensity = "0px";  // No blur for wider views
              opacity = 0.5;
              fillOpacity = 0.5;
              break;
          case 9:
              blurIntensity = "5px";  // Introduce blur as you zoom in
              opacity = 0.8;
              fillOpacity = 0.8;
              break;
          case 10:
              blurIntensity = "15px";
              opacity = 0.7;
              fillOpacity = 0.7;
              break;
          case 11:
              blurIntensity = "30px";
              opacity = 0.4;
              fillOpacity = 0.4;
              break;
          case 12:
              blurIntensity = "40px";
              opacity = 0.2;
              fillOpacity = 0.2;
              break;
          case 13:
              blurIntensity = "50px";  // No blur as layer becomes invisible
              opacity = 0.01;
              fillOpacity = 0.01;
              break;
          default:
              blurIntensity = "100px";  // Ensure layer remains invisible
              opacity = 0.01;
              fillOpacity = 0.01;
              break;
      }
      return { blur: blurIntensity, opacity: opacity, fillOpacity: fillOpacity };
  },
  // Function to add Vermont mask layer using a feature layer
  addVermontMaskLayer(map) {
    if (L.esri) {
      const vermontMaskUrl = 'https://services5.arcgis.com/Uzks6LSde6r23wwG/arcgis/rest/services/Vermont_Mask/FeatureServer/0';
      L.esri.featureLayer({
        url: vermontMaskUrl,
        token: apiKey, // Pass the API key [0]
        style: () => ({
          color: '#FFFFFF', // Example style, adjust as needed
          weight: 3,
          opacity: 1,
          fillOpacity: 0.8
        })
      }).addTo(map);
    } else {
      console.error('Esri Leaflet library is not loaded.');
    }
  },
};