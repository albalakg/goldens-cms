import Vue from 'vue'
import Vuex from 'vuex'

import AppState from './modules/appState'
import UserState from './modules/userState'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AppState,
    UserState,
  }
})
