import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'element-plus/dist/index.css'
import '@/assets/css/github-markdown-light.css'
import '@/components/table/customTableStyle.scss'

const app = createApp(App)

app.use(store)
app.use(router)
app.mount('#app')
