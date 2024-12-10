import { createStore } from 'vuex';
import hutsModule from './modules/huts';
import trailforksModule from './modules/trailforks';
import businessesModule from './modules/businesses';
import selectedFeatureModule from './modules/selectedFeature';
import poiModule from './modules/poi';
import routeModule from './modules/route';
import veloSimpleModule from './modules/veloSimple'; // Add this line

export default createStore({
  modules: {
    huts: hutsModule,
    trailforks: trailforksModule,
    businesses: businessesModule,
    selectedFeature: selectedFeatureModule,
    route: routeModule,
    poi: poiModule,
    veloSimple: veloSimpleModule, // Add this line
  },
});