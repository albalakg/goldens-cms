import Vue from 'vue'
import Vuex from 'vuex'

import AppState             from './modules/AppState'
import UserState            from './modules/UserState'
import MessageState         from './modules/MessageState'
import VideoState           from './modules/VideoState'
import TrainingOptionState  from './modules/TrainingOptionState'
import SkillState           from './modules/SkillState'
import TermState            from './modules/TermState'
import EquipmentState       from './modules/EquipmentState'
import CourseState          from './modules/CourseState'
import CourseCategoryState  from './modules/CourseCategoryState'
import CourseAreaState      from './modules/CourseAreaState'
import LessonState          from './modules/LessonState'
import TestState            from './modules/TestState'
import UserCourseState      from './modules/UserCourseState'
import OrderState           from './modules/OrderState'
import SupportState         from './modules/SupportState'
import SearchState          from './modules/SearchState'
import PoliciesState        from './modules/PoliciesState'
import CouponState          from './modules/CouponState'
import TrainerState         from './modules/TrainerState'
import MarketingState       from './modules/MarketingState'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AppState,
    UserState,
    MessageState,
    VideoState,
    TrainingOptionState,
    SkillState,
    TermState,
    EquipmentState,
    CourseState,
    CourseCategoryState,
    CourseAreaState,
    LessonState,
    TestState,
    UserCourseState,
    OrderState,
    SupportState,
    SearchState,
    PoliciesState,
    CouponState,
    TrainerState,
    MarketingState,
  }
})
