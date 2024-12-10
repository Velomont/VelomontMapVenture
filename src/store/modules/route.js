import axios from 'axios';

const state = {
  routeData: null,
  fetchStatus: 'idle',
  fetchError: null,
  trailsData: [],
};

const mutations = {
  SET_ROUTE_DATA(state, data) {
    state.routeData = data;
  },
  SET_FETCH_STATUS(state, status) {
    state.fetchStatus = status;
  },
  SET_FETCH_ERROR(state, error) {
    state.fetchError = error;
  },
  SET_TRAILS_DATA(state, data) {
    state.trailsData = data;
  },
};

const getters = {
  routeData: (state) => state.routeData,
  fetchStatus: (state) => state.fetchStatus,
  fetchError: (state) => state.fetchError,
  trailsData: (state) => state.trailsData,
};

const actions = {
  async fetchRouteData({ commit, dispatch }) {
    const appId = "87";
    const appSecret = "0a3ae65ea7732b6c";
    const routeId = "56569";
    const baseUrl = 'https://www.trailforks.com/api/1/route';
    const params = {
      id: routeId,
      scope: 'full',
      filter: 'rid::3155',
      app_id: appId,
      app_secret: appSecret,
    };

    commit('SET_FETCH_STATUS', 'loading');
    console.log('Fetching route data with params:', params);

    try {
      const response = await axios.get(baseUrl, { params });
      console.log('Route data response:', response);

      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to fetch route data.');
      }

      const route = response.data.data;
      console.log('Raw route data:', route);

      if (!route.track) {
        throw new Error('No track data found in the route.');
      }

      const latLngs = route.track.latitude.split(',').map((lat, idx) => [
        parseFloat(route.track.longitude.split(',')[idx]),
        parseFloat(lat),
      ]);

      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: latLngs,
            },
            properties: {
              name: route.title,
              difficulty: route.difficulty,
              type: route.activitytype_alias,
              status: route.status,
            },
          },
        ],
      };

      console.log('Transformed GeoJSON data:', geojson);

      commit('SET_ROUTE_DATA', geojson);
      commit('SET_FETCH_STATUS', 'success');

      // Fetch details for all trails in the route
      await dispatch('fetchTrailsData', route.trails);

    } catch (error) {
      console.error('Error fetching route data:', error);
      commit('SET_FETCH_STATUS', 'error');
      commit('SET_FETCH_ERROR', error.toString());
    }
  },

  async fetchTrailsData({ commit }, trails) {
    const appId = "87";
    const appSecret = "0a3ae65ea7732b6c";
    const baseUrl = 'https://www.trailforks.com/api/1/trail';
    const trailsData = [];

    for (const trail of trails) {
      const params = {
        id: trail.trailid,
        scope: 'full',
        app_id: appId,
        app_secret: appSecret,
      };

      try {
        const response = await axios.get(baseUrl, { params });
        console.log(`Trail data response for ID ${trail.trailid}:`, response);

        if (response.data.error) {
          throw new Error(response.data.message || `Failed to fetch trail data for ID ${trail.trailid}.`);
        }

        trailsData.push(response.data.data);

      } catch (error) {
        console.error(`Error fetching trail data for ID ${trail.trailid}:`, error);
      }
    }

    commit('SET_TRAILS_DATA', trailsData);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
