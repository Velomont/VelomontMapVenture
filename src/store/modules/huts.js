// src/store/modules/huts.js
import axios from 'axios';

const state = {
  hutsLayer: null,
  hutsData: [], // Added to store raw hut data
};

const mutations = {
  SET_HUTS_LAYER(state, layer) {
    state.hutsLayer = layer;
  },
  SET_HUTS_DATA(state, data) { // Add this mutation
    state.hutsData = data;
  },
};

const getters = {
  hutsLayer: state => state.hutsLayer,
  hutsData: state => state.hutsData, // Add this getter
};

const actions = {
  fetchHutsData({ commit }) {
    const url = 'https://services7.arcgis.com/Tnov4kXcO2klXM4Y/ArcGIS/rest/services/Vermont_Huts_Association_-_Existing_and_Proposed_Huts__view/FeatureServer/0/query?where=HutType%3D%27Existing%27&outFields=Name, HutType, HutOwnership, URL, ShareLocation, HutPartner,&returnGeometry=true&f=geojson';
    axios.get(url)
      .then(response => {
        commit('SET_HUTS_LAYER', response.data);
        commit('SET_HUTS_DATA', response.data.features); 
        console.log(response.data); 
      })
      .catch(error => console.error('Error fetching huts data:', error));
  },
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};