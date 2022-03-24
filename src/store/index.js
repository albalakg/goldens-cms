import Vue from 'vue'
import Vuex from 'vuex'

import appState from './modules/appState'
import userState from './modules/userState'
import messageState from './modules/messageState'
import videoState from './modules/videoState'
import courseState from './modules/courseState'
import courseCategoryState from './modules/courseCategoryState'
import courseAreaState from './modules/courseAreaState'
import lessonState from './modules/lessonState'
import testState from './modules/testState'
import userCourseState from './modules/userCourseState'
import orderState from './modules/orderState'
import supportState from './modules/supportState'
import searchState from './modules/searchState'
import policiesState from './modules/policiesState'
import couponState from './modules/couponState'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    appState,
    userState,
    messageState,
    videoState,
    courseState,
    courseCategoryState,
    courseAreaState,
    lessonState,
    testState,
    userCourseState,
    orderState,
    supportState,
    searchState,
    policiesState,
    couponState,
  }
})
