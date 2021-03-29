import Vue from 'vue'
import App from './App.vue'
import http from "./config/axios";
import router from "./config/router";
import store from "./config/store";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/assets/scss/index.scss'
// import '@/assets/lib/editormd/css/editormd.min.css'
// import '@/assets/lib/editormd/editormd.min.js'
// import 'tocbot/src/scss/tocbot.scss';


import waterfall from "vue-waterfall2";
import AppUtils from "./utils/app";

Vue.prototype.$AppUtils = AppUtils

Vue.use(ElementUI);
Vue.use(waterfall);
// Vue.use(sdjfk);

Vue.prototype.$http = Vue.$http = http;
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
}).$mount('#app');
