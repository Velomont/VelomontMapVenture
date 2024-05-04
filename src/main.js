// src/main.js
import L from 'leaflet';
import '/node_modules/esri-leaflet/dist/esri-leaflet.js';
import '/node_modules/esri-leaflet-vector/dist/esri-leaflet-vector.js';

import './assets/main.css';


import { createApp } from 'vue'
import App from './App.vue'
import 'primevue/resources/themes/lara-light-amber/theme.css'
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'leaflet/dist/leaflet.css';


import store from './store';
import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import Toolbar from 'primevue/toolbar';
import Avatar from 'primevue/avatar';
import OrderList from 'primevue/orderlist';
import SpeedDial from 'primevue/speeddial';
import Steps from 'primevue/steps';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import Dropdow from 'primevue/dropdown';
import Sidebar from 'primevue/sidebar';
import ToggleButton from 'primevue/togglebutton';




const app = createApp(App)
  app.use(store)
  app.use(PrimeVue, { ripple: true })
  app.component('Avatar', Avatar);
  app.component('Menubar', Menubar)
  app.component('Toolbar', Toolbar)
  app.component('OrderList', OrderList)
  app.component('SpeedDial', SpeedDial)
  app.component('Steps', Steps)
  app.component('SelectButton', SelectButton)
  app.component('Button', Button)
  app.component('Dropdown', Dropdow)
  app.component('Sidebar', Sidebar);
  app.component('ToggleButton', ToggleButton);
  app.mount('#app');