import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import AxiosHandler from './helpers/AxiosHandler'
// eslint-disable-next-line no-unused-vars
import HotKeys from './helpers/HotKeys'
import Auth from "./helpers/Auth";
import DateService from "./helpers/DateService";

Vue.config.productionTip = false

axios.defaults.baseURL                          = process.env.VUE_APP_SERVER_BASE_URL + '/api/';
axios.defaults.headers.common["Authorization"]  = `Bearer ${Auth.token()}`;

window.FORM_DATA_CONFIG = {
  headers: {
      "Content-Type": "multipart/form-data",
  }
}

window.DOMAIN       = 'http://localhost:8083'; //window.location.origin;
window.FILES_PATH   = window.location.origin + "/files/";
window.Auth         = Auth;
window.DateService  = DateService;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
