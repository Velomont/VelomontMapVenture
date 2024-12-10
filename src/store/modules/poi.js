// src/store/modules/poi.js
import axios from 'axios';

const state = {
  parkingLayer: null,
  campingLayer: null,
  placesLayer: null,
  parkingData: [],
  campingData: [],
  placesData: [],
  filteredPlaces: [],
};

const mutations = {
  SET_POI_LAYER(state, { type, layer }) {
    state[`${type}Layer`] = layer;
  },
  SET_POI_DATA(state, { type, data }) {
    state[`${type}Data`] = data;
  },
  SET_FILTERED_PLACES(state, places) {
    state.filteredPlaces = places;
  }  // Add this closing curly brace
};

const getters = {
  parkingLayer: state => state.parkingLayer,
  campingLayer: state => state.campingLayer,
  placesLayer: state => state.placesLayer,
  parkingData: state => state.parkingData,
  campingData: state => state.campingData,
  placesData: state => state.placesData,
  filteredPlacesData: state => state.filteredPlaces,
};

const actions = {
  fetchPOIData({ commit }) {
    const fetchLayerData = (url, type) => {
      axios.get(url)
        .then(response => {
          commit('SET_POI_LAYER', { type, layer: response.data });
          commit('SET_POI_DATA', { type, data: response.data.features });
          console.log(`${type} data:`, response.data);
        })
        .catch(error => console.error(`Error fetching ${type} data:`, error));
    };

    const parkingUrl = 'https://services8.arcgis.com/YKIZLV97YLZN6bol/ArcGIS/rest/services/Parking/FeatureServer/161/query?where=1%3D1&outFields=*&outSR=4326&f=geojson';
    const campingUrl = 'https://services8.arcgis.com/YKIZLV97YLZN6bol/ArcGIS/rest/services/Camping/FeatureServer/162/query?where=1%3D1&outFields=*&outSR=4326&f=geojson';
    const placesUrl = 'https://services8.arcgis.com/YKIZLV97YLZN6bol/ArcGIS/rest/services/Places/FeatureServer/218/query?where=1%3D1&outFields=*&outSR=4326&f=geojson';

    fetchLayerData(parkingUrl, 'parking');
    fetchLayerData(campingUrl, 'camping');
    fetchLayerData(placesUrl, 'places');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
