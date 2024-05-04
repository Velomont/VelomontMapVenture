import { createStore } from 'vuex';
import trailsModule from './modules/trails';
import hutsModule from './modules/huts';
import trailforksModule from './modules/trailforks';

export default createStore({
  modules: {
    trails: trailsModule,
    huts: hutsModule,
    trailforks: trailforksModule,
  },
});