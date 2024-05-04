<!-- src/components/Map.vue -->
<template>
  <div id="map-container">

      
    <Sidebar v-model:visible="visible" position="left">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </Sidebar>
    <ToggleButton v-model="visible" onLabel="On" offLabel="Off" />
    <div id="map"></div>

    <div id="map-controls-container">
      <Button icon="pi pi-plus" @click="zoomIn" />
      <Button icon="pi pi-minus" @click="zoomOut" />
      <Button icon="pi pi-map" @click="resetToHomeView" />
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import '/node_modules/esri-leaflet/dist/esri-leaflet.js';
import '/node_modules/esri-leaflet-vector/dist/esri-leaflet-vector.js';

import { mapState, mapActions, mapGetters } from 'vuex';
import mapService from '@/services/mapService';
import FilterMenu from './FilterMenu.vue';
//import trailforksService from '@/services/trailforksService';
import layerService from '../services/layerService';
import Button from 'primevue/button';
import Sidebar from 'primevue/sidebar';
import Dropdown from 'primevue/dropdown';
import ToggleButton from 'primevue/togglebutton';
import { ref } from "vue";



export default {
  name: 'Map',
  components: {
    FilterMenu,
    Button,
    Sidebar,
    Dropdown,
    ToggleButton,
  },
  data() {
    return {
      showFilterMenu: false,
      visibleLeft: false,
      visible: false,
    
    };
  },
  computed: {
    ...mapGetters({
       hutsData: 'huts/hutsData',
      filteredTrails: 'trails/filteredTrails',
      
      
    }),

     ...mapState('trails', ['selectedTypes', 'selectedDifficulties']),
    
    trailTypes() {
      return ['Single Track', 'Double Track', 'Road'];
    },
    trailDifficulties() {
      return ['Easy', 'More Difficult', 'Very Difficult', 'Extremely Difficult'];
    },
  },
  mounted() {
    this.map = mapService.initMap();
    this.map.on('zoomend moveend', this.handleMapChange);
    trailforksService.init(this.map);
    this.fetchHutsData();
    this.fetchTrailData();
    this.handleMapChange();
    this.fetchTrailforksData();
    layerService.addVectorTileBasemap(this.map);
    //layerService.addVectorTileLabels(this.map);
    layerService.addCorridorMaskLayer(this.map);
    layerService.addVermontMaskLayer(this.map);
  },
  methods: {
    ...mapActions('trails', ['fetchTrailData', 'setSelectedTypes', 'setSelectedDifficulties']),
    ...mapActions('huts', ['fetchHutsData']),
    ...mapActions('trailforks', ['fetchTrailforksData']),

     handleTypeChange() {
        this.setSelectedTypes(this.selectedTypes);
        this.fetchTrailData();
      },
    handleDifficultyChange() {
    this.setSelectedDifficulties(this.selectedDifficulties);
        this.fetchTrailData();
      },
    
    zoomIn() {
      this.map.zoomIn();
    },
    zoomOut() {
      this.map.zoomOut();
    },
    resetToHomeView() {
      this.map.setView([44.5, -72.5], 9);
    },
    handleMapChange() {
      const zoomLevel = this.map.getZoom();
      if (zoomLevel >= 12) {
        const bounds = this.map.getBounds();
        const paddedBounds = bounds.pad(1);
        this.fetchTrailforksData({
          bounds: {
            southWest: paddedBounds.getSouthWest(),
            northEast: paddedBounds.getNorthEast()
          },
          zoomLevel
        });
      }
    },
  },
  watch: {
    '$store.state.trails.trailLayer'() {
      mapService.renderTrailLayer(this.map);
    },
    '$store.state.huts.hutsLayer'() {
      mapService.renderHutsLayer(this.map);
    },
    '$store.state.trailforks.trailforksData'() {
      trailforksService.renderTrailforksLayer(this.map);
    },
  },
};
</script>

<style scoped>
  #map-container {
    position: relative;
    width: 100%;
    height: 720px;
  }
#map {
  width: 100%;
  height: 100%;
}

#map-controls-container {
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#select-button-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  justify-content: center;
}

.filter-menu {
  padding: 1rem;
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

</style>