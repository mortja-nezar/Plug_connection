<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <v-icon icon="mdi-alert-circle-outline" size="128" color="error" class="mb-6" />
        <div class="text-h2 mb-2">404</div>
        <div class="text-h4 mb-4">الصفحة غير موجودة</div>
        <div class="text-body-1 mb-6">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </div>
        <v-btn color="primary" size="large" @click="goHome" prepend-icon="mdi-home">
          العودة للرئيسية
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>