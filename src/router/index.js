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
