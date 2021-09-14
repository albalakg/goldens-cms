import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import axios from "axios";

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:8000/api/';
axios.defaults.headers.common["Authorization"] = `Bearer ${Auth.token()}`;

const FORM_DATA_CONFIG = {
  headers: {
      "Content-Type": "multipart/form-data",
  }
}

import Auth from "./helpers/Auth";
window.Auth = Auth;

// window.axios = axios;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
