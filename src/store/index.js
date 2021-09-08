import Vue from 'vue'
import Vuex from 'vuex'

import AppState from './modules/appState'
import UserState from './modules/userState'
import MessageState from './modules/messageState'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AppState,
    UserState,
    MessageState,
  }
})
