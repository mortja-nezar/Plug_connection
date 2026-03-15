<!-- views/auth/LoginPage.vue -->
<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="4" class="pa-6">
          <v-card-title class="text-center mb-4">
            <v-icon icon="mdi-lock" size="48" class="mb-4" color="primary" />
            <div class="text-h4">تسجيل الدخول</div>
            <div class="text-caption text-medium-emphasis mt-2">
              استخدم أي بيانات للدخول (نظام تجريبي)
            </div>
          </v-card-title>
          
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="البريد الإلكتروني"
              type="email"
              prepend-icon="mdi-email"
              required
              :rules="emailRules"
              placeholder="user@example.com"
              class="mb-3"
            />
            
            <v-text-field
              v-model="password"
              label="كلمة المرور"
              type="password"
              prepend-icon="mdi-lock"
              required
              :rules="passwordRules"
              placeholder="أي كلمة مرور (6 أحرف على الأقل)"
              class="mb-3"
            />
            
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ error }}
            </v-alert>
            
            <v-alert
              type="info"
              variant="tonal"
              class="mb-4"
            >
              <div class="text-caption">
                <strong>بيانات تجريبية:</strong><br>
                البريد: أي بريد صحيح الشكل<br>
                كلمة المرور: 6 أحرف على الأقل
              </div>
            </v-alert>
            
            <v-btn 
              type="submit" 
              color="primary" 
              block 
              size="large"
              class="mt-2"
              :loading="loading"
            >
              تسجيل الدخول
              <template #append>
                <v-icon icon="mdi-login" />
              </template>
            </v-btn>
            
            <div class="text-center mt-4">
              <v-btn 
                variant="text" 
                color="secondary" 
                @click="useDemoCredentials"
                size="small"
              >
                استخدام بيانات تجريبية
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUIStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const uiStore = useUIStore();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const emailRules = [
  (v: string) => !!v || 'البريد الإلكتروني مطلوب',
  (v: string) => /.+@.+\..+/.test(v) || 'بريد إلكتروني صحيح مطلوب'
];

const passwordRules = [
  (v: string) => !!v || 'كلمة المرور مطلوبة',
  (v: string) => (v && v.length >= 6) || 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
];

const useDemoCredentials = () => {
  email.value = 'demo@example.com';
  password.value = 'password123';
};

const login = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    });
    
    uiStore.showNotification('تم تسجيل الدخول بنجاح!', 'success', 2000);
    router.push('/');
    
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تسجيل الدخول';
    uiStore.showNotification(error.value, 'error');
  } finally {
    loading.value = false;
  }
};

// إذا كان المستخدم مسجلاً بالفعل، إعادة توجيه للرئيسية
import { onMounted } from 'vue';
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});
</script>