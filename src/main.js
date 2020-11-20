import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/base.css'

Vue.config.productionTip = false

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowUp, faArrowDown, faTimes, faHeading, faParagraph, faQuoteRight, faVideo, faImage
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faArrowUp,
  faArrowDown,
  faTimes,
  faHeading,
  faParagraph,
  faQuoteRight,
  faVideo,
  faImage
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
