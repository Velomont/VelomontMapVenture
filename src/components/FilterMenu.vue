<!-- src/components/FilterMenu.vue -->
<template>
  <div class="filter-menu">
    <h3>Filter Menu</h3>
    <div class="filter-section">
      <h4>Trail Type</h4>
      <ToggleButton v-for="type in trailTypes" :key="type" v-model="selectedTypes" :value="type" @change="handleTypeChange" />
    </div>
    <div class="filter-section">
      <h4>Difficulty</h4>
      <ToggleButton v-for="difficulty in trailDifficulties" :key="difficulty" v-model="selectedDifficulties" :value="difficulty" @change="handleDifficultyChange" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ToggleButton from 'primevue/togglebutton';

export default {
  name: 'FilterMenu',
  components: {
    ToggleButton,
  },
  computed: {
    ...mapState('trails', ['selectedTypes', 'selectedDifficulties']),
    trailTypes() {
      return ['Single Track', 'Double Track', 'Road'];
    },
    trailDifficulties() {
      return ['Easy', 'More Difficult', 'Very Difficult', 'Extremely Difficult'];
    },
  },
  methods: {
    ...mapActions('trails', ['setSelectedTypes', 'setSelectedDifficulties', 'fetchTrailData']),
    handleTypeChange() {
      this.setSelectedTypes(this.selectedTypes);
      this.fetchTrailData();
    },
    handleDifficultyChange() {
      this.setSelectedDifficulties(this.selectedDifficulties);
      this.fetchTrailData();
    },
  },
};
</script>

<style scoped>
.filter-menu {
  padding: 1rem;
}

.filter-section {
  margin-bottom: 1rem;
}
</style>