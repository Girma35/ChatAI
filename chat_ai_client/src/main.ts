import { createApp } from 'vue'
import './style.css'
import app from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import  piniaPluginPersistetentstate from 'pinia-plugin-persistedstate' 

const App = createApp(app)
const pinia = createPinia()
pinia.use(piniaPluginPersistetentstate)
App.use(pinia)
App.use(router)
App.mount('#app')
