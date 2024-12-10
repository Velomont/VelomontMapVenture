<template>
  <div>
    <div class="header-container">
      <span class="partners-text">partners</span>
      <SelectButton 
        v-model="visibility" 
        :options="visibilityOptions" 
        class="select-button flex justify-content-center" 
        @change="toggleVisibility" />
    </div>
    <div>
      <Dropdown 
        v-model="activeCategory" 
        :options="categories" 
        optionLabel="name" 
        placeholder="Select a Category" 
        class="w-full l:w-12rem" />
    </div>
    <div class="filter-container">
      <div 
        v-for="category in categories" 
        :key="category.name"
        class="filter-button" 
        :class="{ 'active': activeCategory?.name === category.name }"
        @click="toggleBusinessFilter(category)">
        <img :src="category.icon" :alt="category.name" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import Dropdown from 'primevue/dropdown';
import SelectButton from 'primevue/selectbutton';
import mapService from '@/services/mapService';  // Ensure the correct import path

export default {
  name: 'BusinessFilter',
  components: {
    Dropdown,
    SelectButton
  },
  data() {
    return {
      visibility: 'Show All',
      visibilityOptions: ['Show All', 'Hide'],
      activeCategory: null,
      categories: [
        { name: 'DH ', icon: '/icons/dh.svg' },
        { name: 'Eat- Drink-Shop Local', icon: '/icons/eat.svg' },
        { name: 'Lodging', icon: '/icons/lodging.svg' },
        { name: 'Retailers Alliance', icon: '/icons/retailers.svg' },
        { name: 'Fitness and Wellness', icon: '/icons/wellness.svg' }
      ]
    };
  },
  methods: {
    ...mapMutations('businesses', ['setCurrentFilter']),
    toggleBusinessFilter(category) {
      this.activeCategory = this.activeCategory === category ? null : category;
      this.setCurrentFilter(this.activeCategory ? this.activeCategory.name : null);
      this.$emit('filterChanged', this.activeCategory ? this.activeCategory.name : null);
      mapService.updateBusinessLayer(this.$parent.map, true);  // Explicitly show layer
    },
    toggleVisibility() {
      if (this.visibility === 'Show All') {
        this.showAll();
      } else {
        this.hideAll();
      }
    },
    showAll() {
      this.activeCategory = null;
      this.setCurrentFilter(null);
      this.$emit('filterChanged', null);
      this.$emit('toggleVisibility', true); // Emit event to show all
    },
    hideAll() {
      this.activeCategory = { name: 'none' };
      this.setCurrentFilter('none');
      this.$emit('filterChanged', 'none');
      this.$emit('toggleVisibility', false); // Emit event to hide all
    }
  }
}
</script>


<style scoped>
.header {
  font-size: 1.25rem;
  color: #333;
  text-align: center;
  
}
.filter-container {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-radius: 2px;
   background-color: #F1F5F9;
 
 

}

.filter-button img {
  width: 35px; /* Fixed icon size */
  height: 35px; /* Fixed icon size */
  transition: transform 0.3s ease; /* Smooth transition for icon resizing */
  cursor: pointer;
}

.filter-button {
  flex: 1;
  text-align: center;
  display: flex; /* Ensure the content centers align */
  align-items: center; /* Align items vertically */
  justify-content: center; /* Center horizontally */
  padding: 5px;
}

.filter-button:hover img {
  transform: scale(1.2); /* Slightly larger on hover */
}

.filter-button.active img {
  transform: scale(1.4); /* Significantly larger when active */
}

.sidebar-card {
  width: 100%;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  
}




  .select-button .p-button .p-button-label {
    
  }
  .header-container {
     background-color: #F1F5F9;
      display: flex;
      align-items: center; /* Aligns children vertically in the center */
      justify-content: space-between; /* Spaces children out with maximum space between */
       /* Add padding for some space inside the container */
  }

  .logo {
    width: 4.7rem;
    height: auto;
    margin-right: 8px;
    padding-top: 10px;
    padding-right: 10px;
    padding-left: 10px;
    padding-bottom:10px; /* Increase bottom padding */
    box-sizing: border-box;
    border-radius: 2px;
    background-color: #F1F5F9;
  }

  .partners-text {

    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase; /* Uppercase text */

    color: #548541;
  }

</style>
