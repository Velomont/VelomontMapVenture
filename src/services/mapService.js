// mapService.js

import L from 'leaflet';
import 'esri-leaflet';
import 'esri-leaflet-vector';

const apiKey = 'AAPK94098c216903482990ac828c02e90fc5IDLx9lADJDcBVDokCzo74gYufQBjxYLysLpRCxTDT4-7FH34KkHdDSZdQl_A35_p';

let interactiveLayers;

export default {
  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return null;
    }

    const map = L.map(mapElement, {
      center: [44.5, -72.25],
      zoom: 8,
      minZoom: 8,
      maxZoom: 15,
      maxBounds: [[42.5, -74.5], [45.25, -71.0]],
      maxBoundsViscosity: 1.0,
    });
    map.zoomControl.remove();

    // Create panes
    map.createPane('basemap');
    map.createPane('mask');
    map.createPane('protected');
    map.createPane('state');
    map.createPane('otherstates');
    map.createPane('interactive');
    map.createPane('labels');
    map.createPane('geoglabels');

    // Set z-index for each pane
    map.getPane('basemap').style.zIndex = 100;
    map.getPane('mask').style.zIndex = 150;
    map.getPane('protected').style.zIndex = 200;
    map.getPane('state').style.zIndex = 300;
    map.getPane('otherstates').style.zIndex = 400;
    map.getPane('interactive').style.zIndex = 400;
    map.getPane('labels').style.zIndex = 500;
    map.getPane('geoglabels').style.zIndex = 600;

    // Set pointer events
    map.getPane('basemap').style.pointerEvents = 'none';
    map.getPane('mask').style.pointerEvents = 'none';
    map.getPane('protected').style.pointerEvents = 'none';
    map.getPane('state').style.pointerEvents = 'none';
    map.getPane('otherstates').style.pointerEvents = 'none';
    map.getPane('labels').style.pointerEvents = 'none';
    map.getPane('geoglabels').style.pointerEvents = 'none';

    // Create interactive layer group
    interactiveLayers = L.layerGroup([], { pane: 'interactive' }).addTo(map);

    const basemapEnum = '5039bd863e174a70b1442270e52f5308';

    // Add layers
    L.esri.Vector.vectorBasemapLayer(basemapEnum, { apiKey, pane: 'basemap' }).addTo(map);

    // Add Vermont Mask layer
 /*   const vermontMaskVectorTileUrl = 'https://tiles.arcgis.com/tiles/YKIZLV97YLZN6bol/arcgis/rest/services/VermontMask_V3/VectorTileServer';
    L.esri.Vector.vectorTileLayer(vermontMaskVectorTileUrl, {
      apiKey: apiKey,
      pane: 'mask'
    }).addTo(map);
*/
    const protectedLandsVectorTileUrl = 'https://tiles.arcgis.com/tiles/YKIZLV97YLZN6bol/arcgis/rest/services/ProtectedLands_V6/VectorTileServer';
    L.esri.Vector.vectorTileLayer(protectedLandsVectorTileUrl, {
      apiKey: apiKey,
      pane: 'protected'
    }).addTo(map);

    const stateBoundaryVectorTileUrl = 'https://tiles.arcgis.com/tiles/YKIZLV97YLZN6bol/arcgis/rest/services/StateBoundary_V4/VectorTileServer';
    L.esri.Vector.vectorTileLayer(stateBoundaryVectorTileUrl, {
      apiKey: apiKey,
      pane: 'state',
    }).addTo(map);


    const otherstatesVectorTileUrl = 'https://tiles.arcgis.com/tiles/YKIZLV97YLZN6bol/arcgis/rest/services/NortheastStates_V1/VectorTileServer'
    L.esri.Vector.vectorTileLayer(otherstatesVectorTileUrl, {
      apiKey: apiKey,
      pane: 'otherstates',
    }).addTo(map);
    
    const placeLabelsVectorTileUrl = 'https://tiles.arcgis.com/tiles/YKIZLV97YLZN6bol/arcgis/rest/services/Place_Labels_V2/VectorTileServer';
    L.esri.Vector.vectorTileLayer(placeLabelsVectorTileUrl, {
      apiKey: apiKey,
      pane: 'labels',
    }).addTo(map);

    const geogLabelsVectorTileUrl = 'https://tiles.arcgis.com/tiles/YKIZLV97YLZN6bol/arcgis/rest/services/GeographicNames_V2/VectorTileServer';
    L.esri.Vector.vectorTileLayer(geogLabelsVectorTileUrl, {
      apiKey: apiKey,
      pane: 'geoglabels',
    }).addTo(map);

    this.addZoomHandler(map);

    console.log('Map initialized with Vermont mask');
    return map;
  },

  addZoomHandler(map) {
    map.on('zoomend', () => {
      this.updateHighlightCircleSize(map);
    });
    console.log('Zoom handler added');
  },

  checkLayers() {
    console.log('Layers in interactiveLayers:', interactiveLayers.getLayers());
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
        pane: 'interactive',
      }).addTo(map);
    }
  },

  updateHighlightCircleSize(map) {
    if (this.highlightCircle) {
      const currentZoom = map.getZoom();
      const radius = currentZoom >= 14 ? 30 : currentZoom >= 12 ? 20 : 15;
      this.highlightCircle.setRadius(radius);
    }
  },

  getInteractiveLayers() {
    return interactiveLayers;
  }
};
