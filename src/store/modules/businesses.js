// src/store/modules/businesses.js
import axios from 'axios';

const state = {
    businesses: [],
    currentFilter: null  // New state property for the current filter
};

const getters = {
    allBusinesses: (state) => {
        if (!state.currentFilter) {
            return state.businesses;
        }
        return state.businesses.filter(b => b.Category === state.currentFilter);
    }
};

const actions = {
  async fetchBusinesses({ commit }) {
      try {
          const response = await axios.get('/src/assets/VMBA_041924.json');
          console.log("Response data:", response.data);  // Log to check the response data
          const parsedData = parseJSON(response.data);
          commit('setBusinesses', parsedData);
      } catch (error) {
          console.error('Failed to fetch businesses:', error);
          throw error;  // Re-throw to see error details in the console
      }
  }
};

const mutations = {
    setBusinesses: (state, businesses) => (state.businesses = businesses),
    setCurrentFilter: (state, filter) => (state.currentFilter = filter)  // New mutation to set the current filter
};

function parseJSON(data) {
    return Object.keys(data).map(key => ({
        name: key,
        ...data[key]
    }));
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
