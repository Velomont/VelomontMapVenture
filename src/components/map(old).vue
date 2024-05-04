<template>
  <div id="map-container">

    <div id="map"></div>
    <div id="speed-dial-container">
      <SpeedDial :model="items" :radius="70" type="semi-circle" direction="down" />
    </div>
    <div id="map-controls-container">
      <Button icon="pi pi-plus" @click="zoomIn" />
      <Button icon="pi pi-minus" @click="zoomOut" />
      <Button icon="pi pi-map" @click="resetToHomeView" />
    </div>
    <div id="select-button-container" class="card flex justify-content-center">
      <SelectButton v-model="selectedOptions" :options="options" optionLabel="name" multiple aria-labelledby="multiple" />
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import '/node_modules/esri-leaflet/dist/esri-leaflet.js';
import '/node_modules/esri-leaflet-vector/dist/esri-leaflet-vector.js';
import { mapActions, mapGetters } from 'vuex';  
import layerService from '../services/layerService';
import mapService from '@/services/mapService';
import trailforksService from '@/services/trailforksService';
import HutPopup from './HutPopup.vue';
import HutsMenu from './HutsMenu.vue';
import TrailPopup from './TrailPopup.vue';
import TrailsMenu from './TrailsMenu.vue';
import SpeedDial from 'primevue/speeddial';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import Sidebar from 'primevue/sidebar';

export default {
  name: 'Map',
  components: {
    HutPopup,
    HutsMenu,
    TrailPopup,
    TrailsMenu,
    SpeedDial,
    SelectButton,
    Button,
    Sidebar,
  },
  data() {
    return {
      map: null,
      items: [
        {
          label: 'Huts',
          icon: 'pi pi-home',
          command: () => {
            this.showHutsMenu = true;
          },
        },
        {
          label: 'Trails',
          icon: 'pi pi-th-large',
          command: () => {
            this.showTrailsMenu = true;
          },
        },
      ],
      selectedOptions: null,
      options: [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 },
      ],
      showTrailsMenu: false,
      showHutsMenu: false,
    };
  },
  computed: {
    ...mapGetters('huts', ['hutsData']),
  },
  mounted() {

      this.map = mapService.initMap();
      this.map.on('zoomend moveend', this.handleMapChange);
      trailforksService.init(this.map);
      this.fetchHutsData();
      this.fetchTrailData();
      this.handleMapChange(); 
    layerService.addVectorTileBasemap(this.map);
    layerService.addVectorTileLabels(this.map);
    layerService.addCorridorMaskLayer(this.map);
    layerService.addVermontMaskLayer(this.map);
  },
  methods: {
    ...mapActions('map', ['fetchTrailData']),
    ...mapActions('huts', ['fetchHutsData']),
    ...mapActions('trailforks', ['fetchTrailforksData']),
    zoomIn() {
      this.map.zoomIn();
    },
    zoomOut() {
      this.map.zoomOut();
    },
    resetToHomeView() {
      this.map.setView([44.5, -72.5], 9);
    },
    onTrailClick(trail) {
      mapService.openTrailPopup(this.map, trail);
      this.showTrailsMenu = false;
    },
    onHutClick(hut) {
      // Logic to zoom to the clicked hut and open the popup
    },
    handleMapChange() {
      const zoomLevel = this.map.getZoom();
      if (zoomLevel >= 12) {
        const bounds = this.map.getBounds();
        const paddedBounds = bounds.pad(1); // Adjust the padding factor as needed
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
    '$store.state.map.trailLayer'() {
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
  z-index: 1;
}

#map {
  width: 100%;
  height: 100%;
}

#speed-dial-container {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

#map-controls-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
