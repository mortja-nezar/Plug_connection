<!-- views/SettingsPage.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon icon="mdi-cog" class="mr-2" />
              الإعدادات
            </v-toolbar-title>
          </v-toolbar>
          
          <v-card-text class="pa-6">
            <v-tabs v-model="tab" color="primary">
              <v-tab value="general">
                <v-icon icon="mdi-cog-outline" class="mr-2" />
                عام
              </v-tab>
              <v-tab value="appearance">
                <v-icon icon="mdi-palette" class="mr-2" />
                المظهر
              </v-tab>
              <v-tab value="notifications">
                <v-icon icon="mdi-bell" class="mr-2" />
                الإشعارات
              </v-tab>
            </v-tabs>
            
            <v-window v-model="tab" class="mt-6">
              <!-- إعدادات عامة -->
              <v-window-item value="general">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title class="text-h6 mb-4">
                    <v-icon icon="mdi-information" class="mr-2" />
                    معلومات النظام
                  </v-card-title>
                  
                  <v-list>
                    <v-list-item>
                      <template #prepend>
                        <v-icon icon="mdi-tag" color="primary" />
                      </template>
                      <v-list-item-title>إصدار التطبيق</v-list-item-title>
                      <v-list-item-subtitle>1.0.0</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <template #prepend>
                        <v-icon icon="mdi-calendar" color="secondary" />
                      </template>
                      <v-list-item-title>تاريخ الإنشاء</v-list-item-title>
                      <v-list-item-subtitle>2024</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <template #prepend>
                        <v-icon icon="mdi-code-tags" color="success" />
                      </template>
                      <v-list-item-title>الإطار</v-list-item-title>
                      <v-list-item-subtitle>Vue 3 + Vuetify 3 + TypeScript</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                  
                  <v-divider class="my-4" />
                  
                  <div class="text-center mt-4">
                    <v-btn color="primary" @click="clearCache" prepend-icon="mdi-broom">
                      مسح ذاكرة التخزين المؤقت
                    </v-btn>
                  </div>
                </v-card>
              </v-window-item>
              
              <!-- إعدادات المظهر -->
              <v-window-item value="appearance">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title class="text-h6 mb-4">
                    <v-icon icon="mdi-palette" class="mr-2" />
                    إعدادات المظهر
                  </v-card-title>
                  
                  <v-list>
                    <v-list-item>
                      <v-list-item-title class="mb-2">الوضع</v-list-item-title>
                      <v-radio-group v-model="themeMode" inline>
                        <v-radio label="فاتح" value="light" />
                        <v-radio label="مظلم" value="dark" />
                        <v-radio label="تلقائي" value="auto" />
                      </v-radio-group>
                    </v-list-item>
                    
                    <v-list-item>
                      <v-list-item-title class="mb-2">حجم الخط</v-list-item-title>
                      <v-slider
                        v-model="fontSize"
                        :min="12"
                        :max="18"
                        :step="1"
                        thumb-label
                        color="primary"
                      >
                        <template #append>
                          <span class="text-caption">{{ fontSize }}px</span>
                        </template>
                      </v-slider>
                    </v-list-item>
                    
                    <v-list-item>
                      <v-list-item-title class="mb-2">الكثافة</v-list-item-title>
                      <v-select
                        v-model="density"
                        :items="densityOptions"
                        density="compact"
                      />
                    </v-list-item>
                  </v-list>
                  
                  <div class="text-center mt-4">
                    <v-btn color="primary" @click="applyAppearance" prepend-icon="mdi-check">
                      تطبيق التغييرات
                    </v-btn>
                  </div>
                </v-card>
              </v-window-item>
              
              <!-- إعدادات الإشعارات -->
              <v-window-item value="notifications">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title class="text-h6 mb-4">
                    <v-icon icon="mdi-bell" class="mr-2" />
                    إعدادات الإشعارات
                  </v-card-title>
                  
                  <v-list>
                    <v-list-item v-for="setting in notificationSettings" :key="setting.id">
                      <template #prepend>
                        <v-switch
                          v-model="setting.enabled"
                          color="primary"
                          density="compact"
                          hide-details
                        />
                      </template>
                      <v-list-item-title>{{ setting.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ setting.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                  
                  <div class="text-center mt-4">
                    <v-btn color="primary" @click="saveNotificationSettings" prepend-icon="mdi-content-save">
                      حفظ الإعدادات
                    </v-btn>
                  </div>
                </v-card>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';

const uiStore = useUIStore();
const authStore = useAuthStore();

const tab = ref('general');
const themeMode = ref('auto');
const fontSize = ref(14);
const density = ref('comfortable');

const densityOptions = [
  { title: 'مريح', value: 'comfortable' },
  { title: 'مضغوط', value: 'compact' },
  { title: 'مضغوط جداً', value: 'default' }
];

const notificationSettings = ref([
  {
    id: 1,
    title: 'إشعارات النظام',
    description: 'تلقي إشعارات حول تحديثات النظام',
    enabled: true
  },
  {
    id: 2,
    title: 'إشعارات المستخدمين',
    description: 'إشعارات عند إضافة مستخدمين جدد',
    enabled: true
  },
  {
    id: 3,
    title: 'إشعارات المقالات',
    description: 'إشعارات عند إضافة مقالات جديدة',
    enabled: false
  },
  {
    id: 4,
    title: 'إشعارات الألبومات',
    description: 'إشعارات عند إضافة ألبومات جديدة',
    enabled: true
  },
  {
    id: 5,
    title: 'إشعارات البريد الإلكتروني',
    description: 'إرسال نسخة من الإشعارات على البريد',
    enabled: false
  }
]);

onMounted(() => {
  // تحميل الإعدادات المحفوظة
  const savedSettings = localStorage.getItem('app_settings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    themeMode.value = settings.themeMode || 'auto';
    fontSize.value = settings.fontSize || 14;
    density.value = settings.density || 'comfortable';
  }
});

const clearCache = () => {
  // مسح cache محدد
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('cache_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  uiStore.showNotification('تم مسح ذاكرة التخزين المؤقت', 'success');
};

const applyAppearance = () => {
  // تطبيق إعدادات المظهر
  if (themeMode.value === 'light' || themeMode.value === 'dark') {
    uiStore.setTheme(themeMode.value);
  } else if (themeMode.value === 'auto') {
    // تلقائي - اتبع إعدادات النظام
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    uiStore.setTheme(prefersDark ? 'dark' : 'light');
  }
  
  // حفظ الإعدادات
  const settings = {
    themeMode: themeMode.value,
    fontSize: fontSize.value,
    density: density.value
  };
  
  localStorage.setItem('app_settings', JSON.stringify(settings));
  
  uiStore.showNotification('تم تطبيق إعدادات المظهر', 'success');
};

const saveNotificationSettings = () => {
  // حفظ إعدادات الإشعارات
  localStorage.setItem('notification_settings', JSON.stringify(notificationSettings.value));
  uiStore.showNotification('تم حفظ إعدادات الإشعارات', 'success');
};
</script>