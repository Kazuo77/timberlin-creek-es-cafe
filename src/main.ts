import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
if (import.meta.env.DEV) {
  import('eruda').then(eruda => eruda.default.init());
}

const app = createApp(App)
app.use(router)
app.mount('#app')
