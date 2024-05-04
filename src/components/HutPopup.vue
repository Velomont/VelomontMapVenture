<!-- src/components/HutPopup.vue -->
<template>
  <div class="p-4 font-sans">
    <h4 class="mb-2 text-lg font-bold">{{ name }}</h4>
    <p class="mb-1 text-sm">Partner: {{ partner || 'N/A' }}</p>
    <p class="mb-2 text-sm">Popup Info: {{ popupInfo || 'N/A' }}</p>
    <button class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600" @click="handleReservation">Make Reservation</button>
  </div>
</template>

<script>
export default {
  name: 'HutPopup',
  props: {
    name: {
      type: String,
      required: true,
    },
    partner: {
      type: String,
      default: '',
    },
    popupInfo: {
      type: String,
      default: '',
    },
    reservationUrl: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleReservation() {
      if (this.reservationUrl) {
        window.open(this.reservationUrl, '_blank');
      }
    },
  },
};
</script>