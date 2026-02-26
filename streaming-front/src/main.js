//! ============================================================================
//! MAIN APPLICATION ENTRY POINT
//! ============================================================================

//! ================ CSS ===========================
import './assets/css/main.css'

//! ================ VUE ===========================
import { ref } from 'vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

//! ================ COMPONENTS ====================

//! ================ HELPERS =======================

//! ================ ROUTER ========================
import initRouter from './router'

//! ================ INITIALIZATION ================

// экземпляр приложения ----------------------------
const app = createApp(App)

// экземпляр роутера -------------------------------
const router = initRouter()
app.use(router)

//pinia --------------------------------------------
app.use(createPinia())

// requester плагин --------------------------------
// плагин аутентификации ---------------------------
// обработчик навигации ----------------------------
// css для размера экрана --------------------------

async function mountApp() {
    // app.config.globalProperties.getImage = image
    app.mount('#app')
}
mountApp()