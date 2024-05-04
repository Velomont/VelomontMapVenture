<!-- src/components/TrailPopup.vue -->
<template>
  <div class="p-4 font-sans">
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
export default {
  name: 'TrailPopup',
  props: {
    trailType: {
      type: String,
      default: null,
    },
    trailName: {
      type: String,
      default: null,
    },
    trailManager: {
      type: String,
      default: null,
    },
    phase: {
      type: String,
      default: null,
    },
    difficultyRating: {
      type: String,
      default: null,
    },
    constructionStatus: {
      type: String,
      default: null,
    },
    miles: {
      type: Number,
      default: null,
    },
  },
};
</script>