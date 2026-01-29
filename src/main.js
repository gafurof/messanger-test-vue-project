import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router.js'
import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)
app.use(router)
app.use(createPinia())

app.mount('#app')
