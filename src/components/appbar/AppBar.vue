<template>
  <v-app-bar
    elevation="3"
    prominent
  >
    <!-- زر القائمة -->
    <v-app-bar-nav-icon @click="uiStore.toggleDrawer">
      <v-icon>
        {{ uiStore.drawer ? 'mdi-close' : 'mdi-menu' }}
      </v-icon>
    </v-app-bar-nav-icon>

    <!-- العنوان -->
    <v-toolbar-title class="font-weight-bold text-white">
      <v-icon icon="mdi-connection" class="mr-2" />
      اتصال المكونات
    </v-toolbar-title>

    <v-spacer />

    <!-- زر تحديث البيانات -->
    <v-btn
      icon="mdi-refresh"
      variant="text"
      :loading="dataStore.isLoading"
      @click="refreshAllData"
    />

    <!-- زر الوضع المظلم -->
    <v-btn
      icon
      variant="text"
      @click="toggleTheme"
    >
      <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <!-- قائمة الإحصائيات -->
    <v-menu location="bottom">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-chart-bar"
          variant="text"
        />
      </template>

      <v-card min-width="250">
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title>المستخدمين</v-list-item-title>
            <template #append>
              <v-chip size="x-small">
                {{ dataStore.totalUsers }}
              </v-chip>
            </template>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>المقالات</v-list-item-title>
            <template #append>
              <v-chip size="x-small">
                {{ dataStore.totalPosts }}
              </v-chip>
            </template>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>الألبومات</v-list-item-title>
            <template #append>
              <v-chip size="x-small">
                {{ dataStore.totalAlbums }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUIStore, useDataStore } from "@/stores";
import { useTheme } from "vuetify";

const uiStore = useUIStore();
const dataStore = useDataStore();
const theme = useTheme(); // الطريقة الصحيحة

// حالة الثيم الحالية
const isDark = ref(theme.global.current.value.name === 'dark');
const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark';
  theme.change(newTheme);
  isDark.value = newTheme === 'dark';
  uiStore.showNotification(
    isDark.value ? "تم تفعيل الوضع المظلم" : "تم تفعيل الوضع الفاتح",
    "info",
    2000
  );
};


const refreshAllData = async () => {
  try {
    await dataStore.fetchAllData();
    uiStore.showNotification("تم تحديث البيانات بنجاح", "success", 2000);
  } catch {
    uiStore.showNotification("فشل تحديث البيانات", "error", 2000);
  }
};
</script>


<style scoped>
.v-toolbar-title {
  letter-spacing: 0.5px;
}
</style>
