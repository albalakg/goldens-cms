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
        path: 'show/:userID',
        name: 'CoursesShow',
        component: () => import('../views/Content/Courses/CoursesShow.vue'),
      },
    ]
  },
  // ***** COURSES END *****

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
        path: 'show/:userID',
        name: 'VideosShow',
        component: () => import('../views/Content/Videos/VideosShow.vue'),
      },
    ]
  },
  // ***** VIDEOS END *****

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
