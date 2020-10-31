import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Axios from 'axios';

import * as pc from 'playcanvas';
import * as pcx from 'playcanvas/build/playcanvas-extras';

window.pc = pc; // Used for the MiniStats (pcx)

Vue.prototype.$pc = window.pc;
Vue.prototype.$pcx = pcx;
Vue.prototype.$axios = Axios;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
