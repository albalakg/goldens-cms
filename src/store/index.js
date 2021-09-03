import Vue from 'vue'
import Vuex from 'vuex'

import AppState from './modules/appState'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AppState
  }
})
