import Vue                  from 'vue'
import Vuex                 from 'vuex'

import AppState             from './modules/AppState'
import UserState            from './modules/UserState'
import MessageState         from './modules/MessageState'
import VideoState           from './modules/VideoState'
import CourseState          from './modules/CourseState'
import CourseCategoryState  from './modules/CourseCategoryState'
import CourseAreaState      from './modules/CourseAreaState'
import LessonState          from './modules/LessonState'
import TestState            from './modules/TestState'
import UserCourseState      from './modules/UserCourseState'
import OrderState           from './modules/OrderState'
import SupportState         from './modules/SupportState'
import SearchState          from './modules/SearchState'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AppState,
    UserState,
    MessageState,
    VideoState,
    CourseState,
    CourseCategoryState,
    CourseAreaState,
    LessonState,
    TestState,
    UserCourseState,
    OrderState,
    SupportState,
    SearchState,
  }
})
