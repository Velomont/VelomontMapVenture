// src/main.js
import L from 'leaflet';
import '/node_modules/esri-leaflet/dist/esri-leaflet.js';
import '/node_modules/esri-leaflet-vector/dist/esri-leaflet-vector.js';

import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import 'leaflet/dist/leaflet.css';

import store from './store';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

import Menubar from 'primevue/menubar';
import Toolbar from 'primevue/toolbar';
import Avatar from 'primevue/avatar';
import OrderList from 'primevue/orderlist';
import SpeedDial from 'primevue/speeddial';
import Steps from 'primevue/steps';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Sidebar from 'primevue/sidebar';
import ToggleButton from 'primevue/togglebutton';
import InputText from 'primevue/inputtext'; // Add InputText
import Textarea from 'primevue/textarea'; // Add Textarea

const Velo = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0'
    },
    green: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#538843', // Primary color
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22'
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#b74326', // Red color
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    white: '#FFFFFF', // Secondary color
    black: '#474747' // Tertiary color
  },
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}'
    },
    colorScheme: {
      light: {
        surface: {
          0: '{white}',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}'
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '{white}',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}'
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}'
        },
        mask: {
          background: 'rgba(0,0,0,0.4)',
          color: '{surface.200}'
        },
        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.200}',
          filledBackground: '{surface.50}',
          filledFocusBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.500}',
          color: '{surface.700}',
          disabledColor: '{surface.500}',
          placeholderColor: '{surface.500}',
          floatLabelColor: '{surface.500}',
          floatLabelFocusColor: '{surface.500}',
          floatLabelInvalidColor: '{red.500}',
          iconColor: '{surface.400}',
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)'
        },
        text: {
          color: '{surface.700}',
          hoverColor: '{surface.800}',
          mutedColor: '{surface.500}',
          hoverMutedColor: '{surface.600}'
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          borderColor: '{surface.200}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}'
        },
        overlay: {
          select: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          },
          popover: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          },
          modal: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          }
        },
        list: {
          option: {
            focusBackground: '{surface.100}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focusBackground}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            selectedColor: '{highlight.color}',
            selectedFocusColor: '{highlight.focusColor}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}'
            }
          },
          optionGroup: {
            background: 'transparent',
            color: '{text.muted.color}'
          }
        },
        navigation: {
          item: {
            focusBackground: '{surface.100}',
            activeBackground: '{surface.100}',
            color: '{text.color}',
            focusColor: '{text.hover.color}',
            activeColor: '{text.hover.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}',
              activeColor: '{surface.500}'
            }
          },
          submenuLabel: {
            background: 'transparent',
            color: '{text.muted.color}'
          },
          submenuIcon: {
            color: '{surface.400}',
            focusColor: '{surface.500}',
            activeColor: '{surface.500}'
          }
        }
      }
    }
  }
});

const app = createApp(App);
app.use(store);
app.use(PrimeVue, { 
  theme: { 
    preset: Velo, 
    options: {
      darkModeSelector: '.my-app-dark', // Ensure this class is not present unless you want dark mode
      cssLayer: false 
    }
  } 
});
app.component('Avatar', Avatar);
app.component('Menubar', Menubar);
app.component('Toolbar', Toolbar);
app.component('OrderList', OrderList);
app.component('SpeedDial', SpeedDial);
app.component('Steps', Steps);
app.component('SelectButton', SelectButton);
app.component('Button', Button);
app.component('Dropdown', Dropdown);
app.component('Sidebar', Sidebar);
app.component('ToggleButton', ToggleButton);
app.component('InputText', InputText); // Register InputText
app.component('Textarea', Textarea); // Register Textarea

app.mount('#app');
