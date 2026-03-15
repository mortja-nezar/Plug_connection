// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import vuetify from './plugins/vuetify'
import mitt from 'mitt'
import './styles/main.scss' // أضف هذا
import '@mdi/font/css/materialdesignicons.css' // الاستدعاء هنا أفضل للـ Build

// إنشاء التطبيق
const app = createApp(App)

// إعداد Event Bus
const emitter = mitt()
app.provide('emitter', emitter)

// تثبيت Plugins
app.use(createPinia())
app.use(router)
app.use(vuetify)

// معالج الأخطاء العالمي
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]:', err)
  console.error('[Component]:', instance?.$options.name || 'Unknown')
  console.error('[Info]:', info)
  
  // يمكنك إضافة إرسال الأخطاء لخدمة مثل Sentry هنا
  if (import.meta.env.PROD) {
    // إرسال الخطأ للخادم
    // sendErrorToServer(err)
  }
}

// تحذير التحسينات
if (import.meta.env.DEV) {
  console.log('🚀 Development mode')
  console.log('📦 Vuetify 3 with auto-import')
  console.log('⚡ Vite 5.4.4')
}

// التركيب
app.mount('#app')

// تصدير للتطوير
declare global {
  interface Window {
    $vueApp?: typeof app
  }
}

if (import.meta.env.DEV) {
  window.$vueApp = app
}