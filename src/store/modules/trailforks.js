import axios from 'axios';

const state = {
  trailforksData: null,
  fetchStatus: 'idle',
  fetchError: null,
};

const mutations = {
  SET_TRAILFORKS_DATA(state, data) {
    state.trailforksData = data;
  },
  SET_FETCH_STATUS(state, status) {
    state.fetchStatus = status;
  },
  SET_FETCH_ERROR(state, error) {
    state.fetchError = error;
  },
};

const getters = {
  trailforksData: (state) => state.trailforksData,
  fetchStatus: (state) => state.fetchStatus,
  fetchError: (state) => state.fetchError,
};

const actions = {
  async fetchTrailforksData({ commit }) {
    const appId = "87";
    const appSecret = "0a3ae65ea7732b6c";
    const baseUrl = 'https://www.trailforks.com/api/1/trails';
    const params = {
      scope: 'full',
      filter: 'rid::3155',
      rows: 3000,
      app_id: appId,
      app_secret: appSecret,
    };

    commit('SET_FETCH_STATUS', 'loading');

    try {
      const response = await axios.get(baseUrl, { params });
      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to fetch trail data.');
      }

      const trails = response.data.data;
      const geojson = {
        type: 'FeatureCollection',
        features: trails.map(trail => {
          const latLngs = trail.track.latitude.split(',').map((lat, idx) => [
            parseFloat(trail.track.longitude.split(',')[idx]),
            parseFloat(lat),
          ]);
          return {
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
          };
        }),
      };

      commit('SET_TRAILFORKS_DATA', geojson);
      commit('SET_FETCH_STATUS', 'success');
    } catch (error) {
      console.error('Error fetching Trailforks data:', error);
      commit('SET_FETCH_STATUS', 'error');
      commit('SET_FETCH_ERROR', error.toString());
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};