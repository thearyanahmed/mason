import Vue from 'vue'
import VueRouter from 'vue-router'

import TypeWriter from '../views/TypeWriter.vue'

Vue.use(VueRouter)

const routes = [
  {
    name: 'TypeWriter',
    path: '/type-writer',
    component: TypeWriter
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
