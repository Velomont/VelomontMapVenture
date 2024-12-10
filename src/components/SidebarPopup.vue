<template>
  <div class="sidebar-popup">
    <div v-if="selectedFeature">
      <component
        :is="currentComponent"
        v-bind="componentProps"
      />
    </div>
    <div v-else>
      <p>Select a feature to see details here</p>
    </div>
  </div>
</template>

<script>
import BusinessPopup from './BusinessPopup.vue';
import HutPopup from './HutPopup.vue';
import TrailPopup from './TrailPopup.vue';

export default {
  name: 'SidebarPopup',
  components: {
    BusinessPopup,
    HutPopup,
    TrailPopup,
  },
  computed: {
    selectedFeature() {
      return this.$store.getters['selectedFeature/selectedFeature'];
    },
    currentComponent() {
      if (!this.selectedFeature) return null;
      switch (this.selectedFeature.type) {
        case 'business':
          return 'BusinessPopup';
        case 'hut':
          return 'HutPopup';
        case 'trail':
          return 'TrailPopup';
        default:
          return null;
      }
    },
    componentProps() {
      if (!this.selectedFeature) return {};
      switch (this.selectedFeature.type) {
        case 'business':
          return {
            name: this.selectedFeature.properties.name,
            address: this.selectedFeature.properties['Physical Address'],
            phone: this.selectedFeature.properties['Phone'],
            category: this.selectedFeature.properties['Category'],
            website: this.selectedFeature.properties['Website'],
          };
        case 'hut':
          return {
            name: this.selectedFeature.properties.Name,
            partner: this.selectedFeature.properties.HutPartner,
            popupInfo: this.selectedFeature.properties.Info,
            reservationUrl: this.selectedFeature.properties.URL,
          };
        case 'trail':
          return {
            trailName: this.selectedFeature.properties.TrailName || 'N/A',
            trailType: this.selectedFeature.properties.TrailType || 'N/A',
            trailManager: this.selectedFeature.properties.TrailManager || 'N/A',
            phase: this.selectedFeature.properties.Phase || 'N/A',
            difficultyRating: this.selectedFeature.properties.DifficultyRating || 'N/A',
            constructionStatus: this.selectedFeature.properties.ConstructionStatus || 'N/A',
            miles: this.selectedFeature.properties.Miles || 'N/A',
          };
        default:
          return {};
      }
    },
  },
};
</script>

<style scoped>

  h4 {
    margin-block-start: 0.5em; /* Adjust to desired top margin */
    margin-block-end: 0.5em;   /* Adjust to desired bottom margin */
    font-weight: bold;
    color: #548541;
  }
.sidebar-popup {

  color: #474747; /* Use the tertiary color for text */
}

.label {
  font-weight: bold;
  color: #538843; /* Primary color for labels */
}

.info {
  margin-top: 8px;
}

.visit-website-btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
}

.visit-website-btn:hover {
  background-color: #0056b3;
}

/* Additional custom CSS for specific elements */

/* Adjust font size of h4 */
.sidebar-popup h4 {
  font-size: 1rem;
  margin-block-start: 0.5em; /* Adjust to desired top margin */
  margin-block-end: 0.5em;   /* Adjust to desired bottom margin */
  font-weight: bold;
  color: #548541;
}

/* Customize link styles */
.visit-website-btn {
  /* Add custom background color */
  background-color: #4caf50;
}

.visit-website-btn:hover {
  /* Add custom hover background color */
  background-color: #388e3c;
}

/* Adjust margin of each paragraph */
.info p {
  margin-bottom: 6px;
}

/* Style PrimeVue icon */
.info i.pi {
  color: #ff5722; /* Change PrimeVue icon color */
  font-size: 1.2rem; /* Adjust PrimeVue icon size */
}
</style>
