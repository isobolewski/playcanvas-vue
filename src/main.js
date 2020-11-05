import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Axios from 'axios';
import * as pc from 'playcanvas';

Vue.prototype.$pc = pc;
Vue.prototype.$axios = Axios;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
