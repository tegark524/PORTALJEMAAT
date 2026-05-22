import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login' // Import pluginnya
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

// 1. Inisialisasi Google Login secara Global
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
})

// 2. Inisialisasi Pinia & Router
app.use(createPinia())
app.use(router)

app.mount('#app')

// 3. Registrasi PWA Service Worker untuk akses Offline & Instalasi Aplikasi
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('Service Worker terdaftar di scope:', reg.scope))
      .catch((err) => console.error('PWA Service Worker gagal didaftarkan:', err))
  })
}

// 4. Inisialisasi OneSignal Web Push
window.OneSignal = window.OneSignal || []
window.OneSignal.push(function () {
  window.OneSignal.init({
    appId: import.meta.env.VITE_ONESIGNAL_APP_ID || "",
    safari_web_id: "",
    notifyButton: {
      enable: false,
    },
    welcomeNotification: {
      enable: true,
      title: "GKJW Sukolilo",
      message: "Terima kasih sudah berlangganan warta dan renungan kami!"
    }
  })
})

