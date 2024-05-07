<template>
  <div id="map-container">
    <Sidebar v-model:visible="visible" position="left">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </Sidebar>
    <div id="map-header">
      <ToggleButton v-model="visible" onLabel="On" offLabel="Off" />
      <InputSwitch label="Remember Me" />
    </div>
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
import 'esri-leaflet';
import 'esri-leaflet-vector';
import { mapState, mapActions, mapGetters } from 'vuex';
import mapService from '@/services/mapService';
import TrailPopup from './TrailPopup.vue';
import HutPopup from './HutPopup.vue';
import Button from 'primevue/button';
import Sidebar from 'primevue/sidebar';
import ToggleButton from 'primevue/togglebutton';
import InputSwitch from 'primevue/inputswitch';

export default {
  name: 'Map',
  components: {
    TrailPopup,
    HutPopup,
    Button,
    Sidebar,
    ToggleButton,
    InputSwitch,
  },
  data() {
    return {
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
    this.fetchHutsData();
    this.fetchTrailData();
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'huts/SET_HUTS_LAYER') {
        mapService.renderHutsLayer(this.map);
      }
      if (mutation.type === 'trails/SET_TRAIL_LAYER') {
        mapService.renderTrailLayer(this.map);
      }
    });
  },
  methods: {
    ...mapActions('trails', ['fetchTrailData']),
    ...mapActions('huts', ['fetchHutsData']),
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
        // Optional data fetching based on bounds
      }
    },
  },
};
</script>

<style scoped>
#map-header {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 3rem;
  background-color: #538843;
}
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

 
 
  
</style>
