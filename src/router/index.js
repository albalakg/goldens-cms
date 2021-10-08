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
    path: '/dashboard',
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

  {
    path: '*',
    name: 'PageNotFound',
    beforeEnter: Guard.admin,
    component: () => import('../views/Errors/PageNotFound.vue')
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
