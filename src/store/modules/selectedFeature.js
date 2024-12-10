const state = {
  selectedFeature: null,
};

const getters = {
  selectedFeature: (state) => state.selectedFeature,
};

const actions = {
  selectFeature({ commit }, feature) {
    commit('setSelectedFeature', feature);
  },
};

const mutations = {
  setSelectedFeature: (state, feature) => (state.selectedFeature = feature),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
