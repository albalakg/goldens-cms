import Vue from 'vue'
import VueRouter from 'vue-router'
import Guard from '../helpers/Guard'

Vue.use(VueRouter)

const routes = [
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
  {
    path: '/dashboard',
    name: 'Dashboard',
    beforeEnter: Guard.admin,
    component: () => import('../views/Dashboard.vue')
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
