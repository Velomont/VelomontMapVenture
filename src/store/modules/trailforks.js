// store/modules/trailforks.js

import axios from 'axios';

const BOUNDING_BOXES = [
  "42.585444,-73.103027,43.323180,-72.736359",
  "43.148092,-73.347473,43.643032,-72.957458",
  "43.517684,-73.107147,44.241264,-72.570190",
  "44.229457,-73.046722,44.692088,-72.397156",
  "44.320901,-72.438354,45.018214,-71.827240"
];

const BIKE_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 12];

const state = {
  bikeTrails: null,
  otherTrails: null,
  fetchStatus: 'idle',
  fetchError: null,
};

const mutations = {
  SET_BIKE_TRAILS(state, data) {
    state.bikeTrails = data;
  },
  SET_OTHER_TRAILS(state, data) {
    state.otherTrails = data;
  },
  SET_FETCH_STATUS(state, status) {
    state.fetchStatus = status;
  },
  SET_FETCH_ERROR(state, error) {
    state.fetchError = error;
  },
};

const getters = {
  bikeTrails: (state) => state.bikeTrails,
  otherTrails: (state) => state.otherTrails,
  fetchStatus: (state) => state.fetchStatus,
  fetchError: (state) => state.fetchError,
};

const actions = {
  async fetchTrailforksData({ commit }) {
    commit('SET_FETCH_STATUS', 'loading');
    commit('SET_FETCH_ERROR', null);

    try {
      const bikeTrails = [];
      const otherTrails = [];

      for (const bbox of BOUNDING_BOXES) {
        try {
          console.log(`Fetching bike trails for bbox: ${bbox}`);
          const bikeTrailsData = await fetchBboxData(bbox, true);
          bikeTrails.push(...bikeTrailsData);

          console.log(`Fetching other trails for bbox: ${bbox}`);
          const otherTrailsData = await fetchBboxData(bbox, false);
          otherTrails.push(...otherTrailsData);
        } catch (bboxError) {
          console.error(`Error fetching data for bbox ${bbox}:`, bboxError);
        }
      }

      console.log(`Total bike trails fetched: ${bikeTrails.length}`);
      console.log(`Total other trails fetched: ${otherTrails.length}`);

      commit('SET_BIKE_TRAILS', bikeTrails);
      commit('SET_OTHER_TRAILS', otherTrails);
      commit('SET_FETCH_STATUS', 'success');
    } catch (error) {
      console.error('Error fetching Trailforks data:', error);
      commit('SET_FETCH_STATUS', 'error');
      commit('SET_FETCH_ERROR', error.toString());
    }
  },
};

async function fetchBboxData(bbox, isBikeTrail) {
  const appId = "87";
  const appSecret = "0a3ae65ea7732b6c";
  const baseUrl = 'https://www.trailforks.com/api/1/maptrails';
  const bikeTypeFilter = isBikeTrail 
    ? `biketype::${BIKE_TYPES.join(',')}`
    : `biketype::!${BIKE_TYPES.join(',')}`;
  const params = {
    app_id: appId,
    app_secret: appSecret,
    output: 'encoded',
    filter: `rid::3155;bbox::${bbox};${bikeTypeFilter}`,
  };

  console.log(`Fetching data from API for bbox ${bbox}, bike trail: ${isBikeTrail}`);
  const response = await axios.get(baseUrl, { params });

  if (response.data.error !== 0) {
    throw new Error(response.data.message || 'Failed to fetch trail data.');
  }

  const trails = response.data.data;
  if (!Array.isArray(trails)) {
    console.warn('Unexpected data format received from Trailforks API:', response.data);
    return [];
  }

  console.log(`Received ${trails.length} trails from API for bbox ${bbox}, bike trail: ${isBikeTrail}`);

  return trails;
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
