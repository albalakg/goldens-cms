import Vue from 'vue'
import VueRouter from 'vue-router'
import Guard from '../helpers/Guard'

Vue.use(VueRouter)

const routes = [

  // ***** AUTH START *****
  {
    path: '/login',
    name: 'Login',
    beforeEnter: Guard.guest,
    component: () => import('../views/Auth/Login.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: Guard.admin,
    component: () => import('../views/Auth/Logout.vue')
  },
  // ***** AUTH END *****

  {
    path: '/',
    name: 'Dashboard',
    beforeEnter: Guard.admin,
    component: () => import('../views/Dashboard.vue')
  },

  // ***** USERS START *****
  {
    path: '/users',
    component: () => import('../views/Users/UsersIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Users',
        component: () => import('../views/Users/UsersList.vue'),
      },
      {
        path: 'new',
        name: 'UsersCreate',
        component: () => import('../views/Users/UsersCreate.vue'),
      },
      {
        path: 'show/:userID',
        name: 'UsersShow',
        component: () => import('../views/Users/UsersShow.vue'),
      },
    ]
  },
  // ***** USERS END *****

  // ***** COURSES START *****
  {
    path: '/content/lessons',
    component: () => import('../views/Content/Lessons/LessonsIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Lessons',
        component: () => import('../views/Content/Lessons/LessonsList.vue'),
      },
      {
        path: 'new',
        name: 'LessonsCreate',
        component: () => import('../views/Content/Lessons/LessonsCreate.vue'),
      },
      {
        path: 'show/:lessonID',
        name: 'LessonsShow',
        component: () => import('../views/Content/Lessons/LessonsShow.vue'),
      },
    ]
  },
  // ***** COURSES END *****

  // ***** LESSONS START *****
  {
    path: '/content/courses',
    component: () => import('../views/Content/Courses/CoursesIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Courses',
        component: () => import('../views/Content/Courses/CoursesList.vue'),
      },
      {
        path: 'recommendations/new',
        name: 'CoursesRecommendationCreate',
        component: () => import('../views/Content/Courses/CourseRecommendationsCreate.vue'),
      },
      {
        path: 'new',
        name: 'CoursesCreate',
        component: () => import('../views/Content/Courses/CoursesCreate.vue'),
      },
      {
        path: 'show/:courseID',
        name: 'CoursesShow',
        component: () => import('../views/Content/Courses/CoursesShow.vue'),
      },
    ]
  },
  // ***** LESSONS END *****

  // ***** CHALLENGES START *****
  {
    path: '/content/challenges',
    component: () => import('../views/Content/Challenges/ChallengesIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Challenges',
        component: () => import('../views/Content/Challenges/ChallengesList.vue'),
      },
      {
        path: 'new',
        name: 'ChallengesCreate',
        component: () => import('../views/Content/Challenges/ChallengesCreate.vue'),
      },
      {
        path: 'show/:challengeID',
        name: 'ChallengesShow',
        component: () => import('../views/Content/Challenges/ChallengesShow.vue'),
      },
    ]
  },
  // ***** CHALLENGES END *****

  // ***** COURSE CATEGORIES START *****
  {
    path: '/content/course-categories',
    component: () => import('../views/Content/CourseCategories/CourseCategoriesIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'CourseCategories',
        component: () => import('../views/Content/CourseCategories/CourseCategoriesList.vue'),
      },
      {
        path: 'new',
        name: 'CourseCategoriesCreate',
        component: () => import('../views/Content/CourseCategories/CourseCategoriesCreate.vue'),
      },
      {
        path: 'show/:courseCategoryID',
        name: 'CourseCategoriesShow',
        component: () => import('../views/Content/CourseCategories/CourseCategoriesShow.vue'),
      },
    ]
  },
  // ***** COURSE CATEGORIES END *****

  // ***** COURSE AREAS START *****
  {
    path: '/content/course-areas',
    component: () => import('../views/Content/CourseAreas/CourseAreasIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'CourseAreas',
        component: () => import('../views/Content/CourseAreas/CourseAreasList.vue'),
      },
      {
        path: 'new',
        name: 'CourseAreasCreate',
        component: () => import('../views/Content/CourseAreas/CourseAreasCreate.vue'),
      },
      {
        path: 'show/:courseAreaID',
        name: 'CourseAreasShow',
        component: () => import('../views/Content/CourseAreas/CourseAreasShow.vue'),
      },
    ]
  },
  // ***** COURSE AREAS END *****

  // ***** COUPONS START *****
  {
    path: '/content/coupons',
    component: () => import('../views/Content/Coupons/CouponsIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Coupons',
        component: () => import('../views/Content/Coupons/CouponsList.vue'),
      },
      {
        path: 'new',
        name: 'CouponsCreate',
        component: () => import('../views/Content/Coupons/CouponsCreate.vue'),
      },
      {
        path: 'show/:couponID',
        name: 'CouponsShow',
        component: () => import('../views/Content/Coupons/CouponsShow.vue'),
      },
    ]
  },
  // ***** COUPONS END *****

  // ***** USERS COURSES START *****
  {
    path: '/users/users-courses/new',
    name: 'UsersCoursesCreate',
    component: () => import('../views/Users/UsersCourses/UsersCoursesCreate.vue'),
    beforeEnter: Guard.admin,
  },
  {
    path: '/users/users-courses/show/:userCourseID',
    name: 'UsersCoursesShow',
    component: () => import('../views/Users/UsersCourses/UsersCoursesShow.vue'),
    beforeEnter: Guard.admin,
  },
  // ***** USERS COURSES END *****

  // ***** USERS CHALLENGES START *****
  {
    path: '/users/users-challenges/:id',
    name: 'UsersChallengesCreate',
    component: () => import('../views/Users/UsersChallenges/UsersChallengesShow.vue'),
    beforeEnter: Guard.admin,
  },
  // ***** USERS CHALLENGES END *****

  // ***** TESTS START *****
  {
    path: '/content/tests',
    component: () => import('../views/Content/Tests/TestsIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Tests',
        component: () => import('../views/Content/Tests/TestsList.vue'),
      },
      {
        path: 'show/:testID',
        name: 'TestsShow',
        component: () => import('../views/Content/Tests/TestsShow.vue'),
      },
    ]
  },
  // ***** TESTS END *****

  // ***** TRAINERS START *****
  {
    path: '/content/trainers',
    component: () => import('../views/Content/Trainers/TrainersIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Trainers',
        component: () => import('../views/Content/Trainers/TrainersList.vue'),
      },
      {
        path: 'new',
        name: 'TrainersCreate',
        component: () => import('../views/Content/Trainers/TrainersCreate.vue'),
      },
      {
        path: 'show/:trainerID',
        name: 'TrainersShow',
        component: () => import('../views/Content/Trainers/TrainersShow.vue'),
      },
    ]
  },
  // ***** TRAINERS END *****

  // ***** MARKETING START *****
  {
    path: '/content/marketings',
    component: () => import('../views/Content/Marketing/MarketingIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Marketing',
        component: () => import('../views/Content/Marketing/MarketingList.vue'),
      },
      {
        path: 'new',
        name: 'MarketingCreate',
        component: () => import('../views/Content/Marketing/MarketingCreate.vue'),
      },
      {
        path: 'show/:marketingID',
        name: 'MarketingShow',
        component: () => import('../views/Content/Marketing/MarketingShow.vue'),
      },
    ]
  },
  // ***** MARKETING END *****

  // ***** VIDEOS START *****
  {
    path: '/content/videos',
    component: () => import('../views/Content/Videos/VideosIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Videos',
        component: () => import('../views/Content/Videos/VideosList.vue'),
      },
      {
        path: 'new',
        name: 'VideosCreate',
        component: () => import('../views/Content/Videos/VideosCreate.vue'),
      },
      {
        path: 'show/:videoID',
        name: 'VideosShow',
        component: () => import('../views/Content/Videos/VideosShow.vue'),
      },
    ]
  },
  // ***** VIDEOS END *****

  // ***** TRAINING OPTIONS START *****
  {
    path: '/content/training-options',
    component: () => import('../views/Content/TrainingOptions/TrainingOptionsIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'TrainingOptions',
        component: () => import('../views/Content/TrainingOptions/TrainingOptionsList.vue'),
      },
      {
        path: 'new',
        name: 'TrainingOptionsCreate',
        component: () => import('../views/Content/TrainingOptions/TrainingOptionsCreate.vue'),
      },
      {
        path: 'show/:trainingOptionID',
        name: 'TrainingOptionsShow',
        component: () => import('../views/Content/TrainingOptions/TrainingOptionsShow.vue'),
      },
    ]
  },
  // ***** TRAINING OPTIONS END *****

  // ***** TERMS START *****
  {
    path: '/content/terms',
    component: () => import('../views/Content/Terms/TermsIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Terms',
        component: () => import('../views/Content/Terms/TermsList.vue'),
      },
      {
        path: 'new',
        name: 'TermsCreate',
        component: () => import('../views/Content/Terms/TermsCreate.vue'),
      },
      {
        path: 'show/:termID',
        name: 'TermsShow',
        component: () => import('../views/Content/Terms/TermsShow.vue'),
      },
    ]
  },
  // ***** TERMS END *****

  // ***** SKILLS START *****
  {
    path: '/content/skills',
    component: () => import('../views/Content/Skills/SkillsIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Skills',
        component: () => import('../views/Content/Skills/SkillsList.vue'),
      },
      {
        path: 'new',
        name: 'SkillsCreate',
        component: () => import('../views/Content/Skills/SkillsCreate.vue'),
      },
      {
        path: 'show/:skillID',
        name: 'SkillsShow',
        component: () => import('../views/Content/Skills/SkillsShow.vue'),
      },
    ]
  },
  // ***** SKILLS END *****

  // ***** EQUIPMENT START *****
  {
    path: '/content/equipment',
    component: () => import('../views/Content/Equipment/EquipmentIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Equipment',
        component: () => import('../views/Content/Equipment/EquipmentList.vue'),
      },
      {
        path: 'new',
        name: 'EquipmentCreate',
        component: () => import('../views/Content/Equipment/EquipmentCreate.vue'),
      },
      {
        path: 'show/:equipmentID',
        name: 'EquipmentShow',
        component: () => import('../views/Content/Equipment/EquipmentShow.vue'),
      },
    ]
  },
  // ***** EQUIPMENT END *****

  // ***** ORDERS START *****
  {
    path: '/orders',
    component: () => import('../views/Orders/OrdersIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Orders',
        component: () => import('../views/Orders/OrdersList.vue'),
      },
      {
        path: 'show/:orderID',
        name: 'OrdersShow',
        component: () => import('../views/Orders/OrdersShow.vue'),
      },
    ]
  },
  // ***** ORDERS END *****

  // ***** SUPPORT TICKETS START *****
  {
    path: '/support/tickets',
    component: () => import('../views/Support/Tickets/SupportTicketIndex.vue'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'SupportTicket',
        component: () => import('../views/Support/Tickets/SupportTicketList.vue'),
      },
      {
        path: 'show/:supportID',
        name: 'SupportTicketShow',
        component: () => import('../views/Support/Tickets/SupportTicketShow.vue'),
      },
    ]
  },
  // ***** SUPPORT TICKETS END *****

  // ***** SUPPORT CATEGORIES START *****
  {
    path: '/support/categories',
    component: () => import('../views/Support/Categories/SupportCategoryIndex'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'SupportCategory',
        component: () => import('../views/Support/Categories/SupportCategoryList.vue'),
      },
      {
        path: 'new',
        name: 'SupportCategoryCreate',
        component: () => import('../views/Support/Categories/SupportCategoryCreate.vue'),
      },
      {
        path: 'show/:supportCategoryID',
        name: 'SupportCategoryShow',
        component: () => import('../views/Support/Categories/SupportCategoryShow.vue'),
      },
    ]
  },
  // ***** SUPPORT CATEGORIES END *****

  // ***** POLICIES TERMS AND CONDITIONS START *****
  {
    path: '/policies/terms-and-conditions',
    component: () => import('../views/Policies/TermsAndConditions/TermsAndConditionsIndex'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'TermsAndConditions',
        component: () => import('../views/Policies/TermsAndConditions/TermsAndConditionsList.vue'),
      },
      {
        path: 'new',
        name: 'TermsAndConditionsCreate',
        component: () => import('../views/Policies/TermsAndConditions/TermsAndConditionsCreate.vue'),
      },
      {
        path: 'show/:termAndConditionID',
        name: 'TermsAndConditionsShow',
        component: () => import('../views/Policies/TermsAndConditions/TermsAndConditionsShow.vue'),
      },
    ]
  },
  // ***** POLICIES TERMS AND CONDITIONS END *****

  // ***** POLICIES COOKIES START *****
  {
    path: '/policies/cookies',
    component: () => import('../views/Policies/Cookies/CookiesIndex'),
    beforeEnter: Guard.admin,
    children: [
      {
        path: '',
        name: 'Cookies',
        component: () => import('../views/Policies/Cookies/CookiesList.vue'),
      },
      {
        path: 'new',
        name: 'CookiesCreate',
        component: () => import('../views/Policies/Cookies/CookiesCreate.vue'),
      },
    ]
  },
  // ***** POLICIES COOKIES END *****

  {
    path: '/settings',
    name: 'Settings',
    beforeEnter: Guard.admin,
    component: () => import('../views/Global/Settings.vue')
  },

  {
    path: '*',
    name: 'PageNotFound',
    beforeEnter: Guard.admin,
    component: () => import('../views/Errors/PageNotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
