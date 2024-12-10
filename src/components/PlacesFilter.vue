<template>
  <div>
    <div class="header-container">
      <span class="places-text">Places</span>
      <SelectButton 
        v-model="visibility" 
        :options="visibilityOptions" 
        class="select-button flex justify-content-center" 
        @change="toggleVisibility" />
    </div>
    <div>
      <Dropdown 
        v-model="selectedType" 
        :options="typeOptions" 
        optionLabel="name" 
        placeholder="Select a Type" 
        class="w-full l:w-12rem"
        @change="applyFilters" />
    </div>
    <div class="filter-container">
      <div 
        v-for="filter in filters" 
        :key="filter.name"
        class="filter-button" 
        :class="{ 'active': filter.active }"
        @click="toggleFilter(filter)">
        <img :src="filter.icon" :alt="filter.name" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Dropdown from 'primevue/dropdown';
import SelectButton from 'primevue/selectbutton';

export default {
  name: 'PlacesFilter',
  components: {
    Dropdown,
    SelectButton
  },
  setup() {
    const store = useStore();
    const visibility = ref('Show All');
    const visibilityOptions = ['Show All', 'Hide'];
    const selectedType = ref(null);
    const filters = ref([
      { name: 'Parking', icon: '/icons/parking.svg', active: false },
      { name: 'Camping', icon: '/icons/camping.svg', active: false },
    ]);

    const typeOptions = computed(() => {
      const types = new Set(store.getters['poi/placesData'].map(place => place.properties.TYPE));
      return Array.from(types).map(type => ({ name: type }));
    });

    const toggleVisibility = () => {
      if (visibility.value === 'Show All') {
        showAll();
      } else {
        hideAll();
      }
    };

    const toggleFilter = (filter) => {
      filter.active = !filter.active;
      applyFilters();
    };


    const applyFilters = () => {
      const activeFilters = filters.value.filter(f => f.active).map(f => f.name.toLowerCase());
      const filteredPlaces = store.getters['poi/placesData'].filter(place => {
        const props = place.properties;
        const typeMatch = !selectedType.value || props.TYPE === selectedType.value.name;
        const parkingMatch = !activeFilters.includes('parking') || props.N_PARKSUM > 0;
        const campingMatch = !activeFilters.includes('camping') || props.CAMP === 'Y';
        return typeMatch && parkingMatch && campingMatch;
      });
      store.commit('poi/SET_FILTERED_PLACES', filteredPlaces);
       mapService.updatePOILayers(map);
    };
    const showAll = () => {
      selectedType.value = null;
      filters.value.forEach(f => f.active = false);
      store.commit('poi/SET_FILTERED_PLACES', store.getters['poi/placesData']);
    };

    const hideAll = () => {
      store.commit('poi/SET_FILTERED_PLACES', []);
    };

    return {
      visibility,
      visibilityOptions,
      selectedType,
      typeOptions,
      filters,
      toggleVisibility,
      toggleFilter,
      applyFilters,
    };
  }
}
</script>

<style scoped>
.header {
  font-size: 1.25rem;
  color: #333;
  text-align: center;

}
.filter-container {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-radius: 2px;
   background-color: #F1F5F9;



}

.filter-button img {
  width: 35px; /* Fixed icon size */
  height: 35px; /* Fixed icon size */
  transition: transform 0.3s ease; /* Smooth transition for icon resizing */
  cursor: pointer;
}

.filter-button {
  flex: 1;
  text-align: center;
  display: flex; /* Ensure the content centers align */
  align-items: center; /* Align items vertically */
  justify-content: center; /* Center horizontally */
  padding: 5px;
}

.filter-button:hover img {
  transform: scale(1.2); /* Slightly larger on hover */
}

.filter-button.active img {
  transform: scale(1.4); /* Significantly larger when active */
}

.sidebar-card {
  width: 100%;
  margin: 10px 0;
  display: flex;
  justify-content: center;

}




  .select-button .p-button .p-button-label {

  }
  .header-container {
     background-color: #F1F5F9;
      display: flex;
      align-items: center; /* Aligns children vertically in the center */
      justify-content: space-between; /* Spaces children out with maximum space between */
       /* Add padding for some space inside the container */
  }

  .logo {
    width: 4.7rem;
    height: auto;
    margin-right: 8px;
    padding-top: 10px;
    padding-right: 10px;
    padding-left: 10px;
    padding-bottom:10px; /* Increase bottom padding */
    box-sizing: border-box;
    border-radius: 2px;
    background-color: #F1F5F9;
  }

  .places-text {

    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase; /* Uppercase text */

    color: #548541;
  }

</style>
