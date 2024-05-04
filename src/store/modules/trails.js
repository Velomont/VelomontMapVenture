// src/store/modules/trails.js
import axios from 'axios';

const state = {
  trailLayer: null,
  selectedTypes: [],
  selectedDifficulties: [],
};

const getters = {
  trailLayer: state => state.trailLayer,
  selectedTypes: state => state.selectedTypes,
  selectedDifficulties: state => state.selectedDifficulties,
  filteredTrails: state => {
    if (!state.trailLayer) return null;

    return {
      ...state.trailLayer,
      features: state.trailLayer.features.filter(trail => {
        const { TrailType, DifficultyRating } = trail.properties;
        return (
          (state.selectedTypes.length === 0 || state.selectedTypes.includes(TrailType)) &&
          (state.selectedDifficulties.length === 0 || state.selectedDifficulties.includes(DifficultyRating))
        );
      }),
    };
  },
};

const mutations = {
  SET_TRAIL_LAYER(state, layer) {
    state.trailLayer = layer;
  },
  SET_SELECTED_TYPES(state, types) {
    state.selectedTypes = types;
  },
  SET_SELECTED_DIFFICULTIES(state, difficulties) {
    state.selectedDifficulties = difficulties;
  },
};

const actions = {
  fetchTrailData({ commit }) {
    const url = 'https://services7.arcgis.com/Tnov4kXcO2klXM4Y/ArcGIS/rest/services/VelomontTrailPlanner_V2/FeatureServer/1/query?where=1%3D1&outFields=TrailType,TrailName,TrailManager,Phase,DifficultyRating,ConstructionStatus,Miles&returnGeometry=true&f=geojson';

    axios.get(url)
      .then(response => {
        commit('SET_TRAIL_LAYER', response.data);
        console.log(response.data); 
      })
      .catch(error => {
        console.error('Error fetching trail data:', error);
      });
  },
  setSelectedTypes({ commit }, types) {
    commit('SET_SELECTED_TYPES', types);
  },
  setSelectedDifficulties({ commit }, difficulties) {
    commit('SET_SELECTED_DIFFICULTIES', difficulties);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};