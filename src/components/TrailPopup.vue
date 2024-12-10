<template>
  <div>
    <h4 class="mb-2 text-lg font-bold">{{ trailName || 'N/A' }}</h4>
    <p class="mb-1 text-sm">Trail Type: {{ trailType || 'N/A' }}</p>
    <p class="mb-1 text-sm">Trail Manager: {{ trailManager || 'N/A' }}</p>
    <p class="mb-1 text-sm">Phase: {{ phase || 'N/A' }}</p>
    <p class="mb-1 text-sm">Difficulty Rating: {{ difficultyRating || 'N/A' }}</p>
    <p class="mb-1 text-sm">Construction Status: {{ constructionStatus || 'N/A' }}</p>
    <p class="mb-2 text-sm">Miles: {{ miles || 'N/A' }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TrailPopup',
  computed: {
    ...mapGetters('selectedFeature', [
      'trailType',
      'trailName',
      'trailManager',
      'phase',
      'difficultyRating',
      'constructionStatus',
      'miles',
    ]),
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
