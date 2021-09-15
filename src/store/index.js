import Vue                  from 'vue'
import Vuex                 from 'vuex'

import AppState             from './modules/appState'
import UserState            from './modules/userState'
import MessageState         from './modules/messageState'
import VideoState           from './modules/videoState'
import CourseState          from './modules/courseState'
import CourseCategoryState  from './modules/courseCategoryState'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AppState,
    UserState,
    MessageState,
    VideoState,
    CourseState,
    CourseCategoryState,
  }
})
