<!-- src/App.vue -->
<template>
  <v-app>
    <CompCon />
    <router-view class="mt-12"/>
  </v-app>
</template>
<script setup lang="ts">
import CompCon from './components/appbar/CompCon.vue';
import { watch } from 'vue';
import { useTheme } from 'vuetify';
import { useUIStore } from '@/stores/uiStore';

const uiStore = useUIStore();
const vuetifyTheme = useTheme();

watch(
  () => uiStore.theme,
  (newTheme) => {
    vuetifyTheme.change(newTheme); // <-- الطريقة الجديدة
  },
  { immediate: true }
);

</script>


