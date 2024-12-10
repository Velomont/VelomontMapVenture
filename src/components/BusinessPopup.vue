<!-- src/components/BusinessPopup.vue -->
<template>
  <div>
    <h4>{{ name }}</h4>
    <p class="mb-1 text-sm">Address: {{ address }}</p>
    <p class="mb-1 text-sm">Phone: {{ phone }}</p>
    <p class="mb-2 text-sm">Category: {{ category }}</p>
    <button class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600" @click="visitWebsite">Visit Website</button>
  </div>
</template>

<script>
export default {
  name: 'BusinessPopup',
  props: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: '',
    },
  },
  methods: {
    visitWebsite() {
      if (this.website) {
        window.open(this.website, '_blank');
      }
    },
  },
};
</script>