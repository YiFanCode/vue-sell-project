import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import App from './App';
import MyRoutes from 'common/js/myRouter';

import 'common/scss/index.scss';

Vue.use(VueRouter);
Vue.prototype.$http = Axios;

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  linkActiveClass: 'active',
  routes: MyRoutes
});

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

router.push('goods');