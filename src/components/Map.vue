<template>
  <div id="app-container">
    <Toolbar id="map-header" style="padding: 0.5rem 1rem; margin-bottom: 10px;">
      <template #start>
        <!-- Add any start content for the toolbar here -->
      </template>
    </Toolbar>
    <div id="map-container">
      <Card id="sidebar" style="width: 310px;">
        <template #title>
          <!-- Add any title content for the sidebar here -->
        </template>
        <template #content>
          <BusinessFilter @filterChanged="handleFilterChange" @toggleVisibility="toggleBusinessLayerVisibility" />
           <PlacesFilter />
          <SidebarPopup />
        </template>
      </Card>
      <Card id="map-card" style="flex-grow: 1;">
        <template #content>
          <div id="map" style="width: 100%; height: 100%;"></div>
          <div id="map-controls-container">
            <Button icon="pi pi-plus" @click="zoomIn" />
            <Button icon="pi pi-minus" @click="zoomOut" />
            <Button icon="pi pi-map" @click="resetToHomeView" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'esri-leaflet';
import 'esri-leaflet-vector';
import { mapActions, mapGetters, mapState } from 'vuex';
import mapService from '@/services/mapService';
import businessService from '@/services/businessService';
import hutService from '@/services/hutService';
import poiService from '@/services/poiService';
import routeService from '@/services/routeService';
import trailforksService from '@/services/trailforksService';
import veloSimpleService from '@/services/velo-simple-service';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Toolbar from 'primevue/toolbar';
import SidebarPopup from './SidebarPopup.vue';
import BusinessFilter from './BusinessFilter.vue';
import PlacesFilter from './PlacesFilter.vue';
import { debounce } from 'lodash';

export default {
  name: 'Map',
  components: {
    Button,
    Card,
    Toolbar,
    SidebarPopup,
    BusinessFilter,
    PlacesFilter,
  },
  data() {
    return {
      map: null,
      poiLayers: null,
      visible: false,
    };
  },
  computed: {
    ...mapGetters({
      hutsData: 'huts/hutsData',
      bikeTrails: 'trailforks/bikeTrails',
      otherTrails: 'trailforks/otherTrails',
    }),
    ...mapState('trailforks', ['fetchStatus'])
  },
  created() {
    this.debouncedHandleMapChange = debounce(this.handleMapChange, 300);
  },
  mounted() {
    this.initMap();
    this.initializeData();

    // Watch for changes in POI data
    this.$store.watch(
      (state) => state.poi,
      () => {
        this.updatePOILayers();
      }
    );

    // Subscribe to mutations
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'huts/SET_HUTS_LAYER':
          hutService.renderHutsLayer(this.map);
          break;
        case 'route/SET_ROUTE_DATA':
          routeService.renderRouteLayer(this.map);
          break;
        case 'businesses/setBusinesses':
          businessService.renderBusinessLayer(this.map, false);
          break;
        case 'trailforks/SET_BIKE_TRAILS':
        case 'trailforks/SET_OTHER_TRAILS':
          this.updateVisibleTrails();
          break;
        case 'poi/SET_FILTERED_PLACES':
          this.updatePOILayers();
          break;
      }
    });
  },
  beforeDestroy() {
    if (this.map) {
      this.map.off('zoomend moveend', this.debouncedHandleMapChange);
    }
    hutService.removeLayer(this.map);
  },
  watch: {
    fetchStatus(newStatus) {
      if (newStatus === 'success') {
        this.updateVisibleTrails();
      }
    }
  },
  methods: {
    ...mapActions('huts', ['fetchHutsData']),
    ...mapActions('businesses', ['fetchBusinesses']),
    ...mapActions('route', ['fetchRouteData']),
    ...mapActions('trailforks', ['fetchTrailforksData']),
    ...mapActions('poi', ['fetchPOIData']),
    ...mapActions('veloSimple', ['fetchVeloSimpleData']),


    initMap() {
      this.map = mapService.initMap();
      this.map.on('zoomend moveend', this.debouncedHandleMapChange);
    },

    async initializeData() {
      await this.fetchTrailforksData();
      await Promise.all([
        this.fetchHutsData(),
        this.fetchBusinesses(),
        this.fetchRouteData(),
        this.fetchPOIData(),
        this.fetchVeloSimpleData(),
      ]);
      this.initializeLayers();
    },

    initializeLayers() {
      hutService.renderHutsLayer(this.map);
      routeService.renderRouteLayer(this.map);
      businessService.renderBusinessLayer(this.map, false);
      this.updateVisibleTrails();
      this.updatePOILayers();
      veloSimpleService.renderVeloSimpleLayer(this.map); // Add this line
      const legend = veloSimpleService.createLegend();
      legend.addTo(this.map);
    },

    updatePOILayers() {
      poiService.updatePOILayers(this.map);
    },

    handleFilterChange(category) {
      this.$store.commit('businesses/setCurrentFilter', category);
      this.$nextTick(() => {
        businessService.updateBusinessLayer(this.map);
      });
    },

    toggleBusinessLayerVisibility(show) {
      businessService.updateBusinessLayer(this.map, show);
    },

    toggleVeloSimpleLayerVisibility(show) {
      const interactiveLayers = mapService.getInteractiveLayers();
      const veloSimpleLayer = interactiveLayers.getLayers().find(layer => layer.feature && layer.feature.properties.Status);
      if (show) {
        if (veloSimpleLayer && !this.map.hasLayer(veloSimpleLayer)) {
          interactiveLayers.addLayer(veloSimpleLayer);
        }
      } else {
        if (veloSimpleLayer && this.map.hasLayer(veloSimpleLayer)) {
          interactiveLayers.removeLayer(veloSimpleLayer);
        }
      }
    },
    
    updateVisibleTrails() {
      if (this.bikeTrails && this.otherTrails && this.map) {
        trailforksService.renderTrailforksLayers(this.map, this.bikeTrails, this.otherTrails);
      } else {
        trailforksService.clearTrailforksLayers(this.map);
      }
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
      this.updateVisibleTrails();
    },
  },
};
</script>






<style scoped>
#app-container {
  max-width: 1600px;
  max-height: 900px;
  width: 100%;
  height: 100vh; /* Change to viewport height */
  margin: 0 auto;
  border: 10px solid #FFFFF3;
  display: flex;
  flex-direction: column;
}

#map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px; /* Adjusted padding for a smaller header */
}

#map-container {
  display: flex;
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
}

#sidebar {
  height: 100%; /* Make the sidebar take up the full height */
  overflow-y: auto; /* Enable scrolling within the sidebar */
  background-color: #FFFFFF; /* Use the secondary color for background */
  color: #474747; /* Use the tertiary color for text */
}

#map-card {
  position: relative;  
  flex-grow: 1;
  overflow: hidden;
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

.sidebar-title {
  display: flex;
  align-items: center;
  background-color: #164351; /* Background color for the logo and text */
  padding: 2px 8px; /* Padding around the logo and text */
  border-radius: 3px; /* Optional: for rounded corners */
}

.logo {
  width: 2.5rem; /* Adjust the logo size */
  height: auto;
  margin-right: 8px;
}

.partners-text {
  font-size: 1rem; /* Make the text as tall as the image */
  font-weight: bold;
  text-transform: uppercase; /* Uppercase text */
  color: #FFFFFF; /* White color for the text */
}
</style>
