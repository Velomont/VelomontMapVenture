// src/store/modules/veloSimple.js
import axios from 'axios';

const state = {
  veloSimpleLayer: null,
  veloSimpleData: [],
};

const mutations = {
  SET_VELO_SIMPLE_LAYER(state, layer) {
    state.veloSimpleLayer = layer;
  },
  SET_VELO_SIMPLE_DATA(state, data) {
    state.veloSimpleData = data;
  },
};

const getters = {
  veloSimpleLayer: state => state.veloSimpleLayer,
  veloSimpleData: state => state.veloSimpleData,
};

const actions = {
  fetchVeloSimpleData({ commit }) {
    const url = 'https://services8.arcgis.com/YKIZLV97YLZN6bol/arcgis/rest/services/SimplifiedSections/FeatureServer/6/query';
    const params = {
      where: '1=1',
      outFields: '*',
      returnGeometry: true,
      f: 'geojson'
    };

    return axios.get(url, { params })
      .then(response => {
        commit('SET_VELO_SIMPLE_LAYER', response.data);
        commit('SET_VELO_SIMPLE_DATA', response.data.features);
        console.log('Velo Simple data fetched:', response.data);
      })
      .catch(error => {
        console.error('Error fetching Velo Simple data:', error);
        throw error;
      });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
