<!-- src/components/TrailsMenu.vue -->
<template>
  <div class="trails-menu">
    <h3>Trails Menu</h3>
    <div class="trail-type">
      <h4>Type</h4>
      <div class="trail-type-option" v-for="type in trailTypes" :key="type">
        <Checkbox v-model="selectedTypes" :value="type" @change="onFilterChange" />
        <label>{{ type }}</label>
      </div>
    </div>
    <div class="trail-difficulty">
      <h4>Difficulty</h4>
      <div class="trail-difficulty-option" v-for="difficulty in trailDifficulties" :key="difficulty">
        <Checkbox v-model="selectedDifficulties" :value="difficulty" @change="onFilterChange" />
        <label>{{ difficulty }}</label>
      </div>
    </div>
    <div class="trail-list">
      <h4>Trails</h4>
      <ul>
        <li v-for="trail in filteredTrails" :key="trail.id" @click="onTrailClick(trail)">
          {{ trail.properties.TrailName }} ({{ trail.properties.Miles }} miles)
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Checkbox from 'primevue/checkbox';

export default {
  name: 'TrailsMenu',
  components: {
    Checkbox,
  },
  data() {
    return {
      trailTypes: ['Single Track', 'Double Track', 'Road'],
      trailDifficulties: ['Easy', 'More Difficult', 'Very Difficult', 'Extremely Difficult'],
    };
  },
  computed: {
    ...mapGetters('trails', ['selectedTypes', 'selectedDifficulties', 'filteredTrails']),
  },
  methods: {
    ...mapActions('trails', ['setSelectedTypes', 'setSelectedDifficulties']),
    onFilterChange() {
      this.setSelectedTypes(this.selectedTypes);
      this.setSelectedDifficulties(this.selectedDifficulties);
    },
    onTrailClick(trail) {
      this.$emit('trail-click', trail);
    },
  },
};
</script>

<style scoped>
.trails-menu {
  padding: 1rem;
}

.trail-type,
.trail-difficulty {
  margin-bottom: 1rem;
}

.trail-type-option,
.trail-difficulty-option {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.trail-list ul {
  list-style: none;
  padding: 0;
}

.trail-list li {
  cursor: pointer;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}

.trail-list li:hover {
  background-color: #f0f0f0;
}
</style>