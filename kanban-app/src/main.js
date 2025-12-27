import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/index.css'

// Créer l'application Vue
const app = createApp(App)

// Utiliser Pinia pour la gestion d'état
app.use(createPinia())

// Utiliser Vue Router
app.use(router)

// Monter l'application
app.mount('#app')