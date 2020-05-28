import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';
import { sync } from 'vuex-router-sync';
import { i18n } from './plugins/i18n';
import { Trans } from './plugins/Translation';

import '@mdi/font/css/materialdesignicons.css';
import 'animate.css/animate.min.css';
import 'v-credit-card/dist/VCreditCard.css';

Vue.prototype.$i18nRoute = Trans.i18nRoute.bind(Trans);
Vue.config.productionTip = false;

sync(store, router);

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
