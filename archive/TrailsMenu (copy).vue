<template>
  <div class="trails-menu">
    <h3>Trails Menu</h3>
    <div class="trail-filters">
      <Dropdown v-model="selectedType" :options="trailTypes" optionLabel="name" placeholder="Select Type" @change="applyFilters" />
      <Dropdown v-model="selectedDifficulty" :options="trailDifficulties" optionLabel="name" placeholder="Select Difficulty" @change="applyFilters" />
    </div>
    <ul>
      <li v-for="trail in filteredTrails" :key="trail.id" @click="onTrailClick(trail)">
        {{ trail.properties.TrailName }} ({{ trail.properties.Miles }} miles)
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Dropdown from 'primevue/dropdown';

export default {
  name: 'TrailsMenu',
  components: {
    Dropdown,
  },
  data() {
    return {
      selectedType: null,
      selectedDifficulty: null,
      trailTypes: [
        { name: 'Single Track', value: 'Single Track' },
        { name: 'Double Track', value: 'Double Track' },
        { name: 'Road', value: 'Road' },
      ],
      trailDifficulties: [
        { name: 'Easy', value: 'Easy' },
        { name: 'More Difficult', value: 'More Difficult' },
        { name: 'Very Difficult', value: 'Very Difficult' },
        { name: 'Extremely Difficult', value: 'Extremely Difficult' },
      ],
    };
  },
  computed: {
    ...mapGetters('map', ['filteredTrails']),
  },
  methods: {
    ...mapActions('map', ['setSelectedTypes', 'setSelectedDifficulties']),
    applyFilters() {
      this.setSelectedTypes(this.selectedType ? [this.selectedType.value] : []);
      this.setSelectedDifficulties(this.selectedDifficulty ? [this.selectedDifficulty.value] : []);
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
.trail-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  cursor: pointer;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}
li:hover {
  background-color: #f0f0f0;
}
</style>