import { addCollection } from '@iconify/vue'
import { createApp } from 'vue'
import app from './app.vue'

import '~/assets/scss/global.scss'
import '~/assets/scss/normalize.scss'

document.documentElement.setAttribute('data-theme', 'dark')

createApp(app).mount('#app')

import('~/assets/icons-bundle.json').then((module) => {
  addCollection(module.default)
})
