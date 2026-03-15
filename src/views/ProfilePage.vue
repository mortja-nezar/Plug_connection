<!-- views/ProfilePage.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h4 mb-4">
            <v-icon icon="mdi-account" class="mr-3" />
            الملف الشخصي
          </v-card-title>
          
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="text-center">
                <v-avatar size="120" color="primary" class="text-white text-h1 mb-4">
                  {{ userInitial }}
                </v-avatar>
                <div class="text-h5">{{ authStore.user?.name }}</div>
                <div class="text-body-1 text-medium-emphasis">{{ authStore.user?.email }}</div>
              </v-col>
              
              <v-col cols="12" md="8">
                <v-list>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-identifier" color="primary" />
                    </template>
                    <v-list-item-title>معرف المستخدم</v-list-item-title>
                    <v-list-item-subtitle>{{ authStore.user?.id }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-account-box" color="secondary" />
                    </template>
                    <v-list-item-title>اسم المستخدم</v-list-item-title>
                    <v-list-item-subtitle>{{ authStore.user?.username }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-shield-key" color="success" />
                    </template>
                    <v-list-item-title>حالة الجلسة</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip size="small" color="success" variant="flat">
                        نشطة
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const userInitial = computed(() => {
  if (!authStore.user?.name) return '?';
  return authStore.user.name.charAt(0).toUpperCase();
});
</script>