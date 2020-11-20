import Vue from 'vue'
import VueRouter from 'vue-router'

import TypeWriter from '../views/TypeWriter.vue'
import Story from '../views/Story.vue'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Home',
    path: '/',
    component: TypeWriter
  },
  {
    name: 'Story',
    path: '/story',
    component: Story,

    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Story.vue')
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
