<!-- NavDrawer.vue -->
<template>
  <v-navigation-drawer
    v-model="uiStore.drawer"
    app
    temporary
    color="surface"
    elevation="4"
    width="280"
    :permanent="$vuetify.display.mdAndUp"
  >
    <!-- رأس التنقل -->
    <v-card color="primary" flat class="px-4 py-6">
      <div class="d-flex align-center justify-center mb-4">
        <v-avatar size="64" color="white" class="elevation-4">
          <v-icon icon="mdi-connection" color="primary" size="32" />
        </v-avatar>
      </div>
      
      <div class="text-center">
        <div class="text-h5 font-weight-bold text-white mb-1">
          اتصال المكونات
        </div>
        <div class="text-caption text-white text-medium-emphasis">
          نظام إدارة متكامل
        </div>
      </div>
    </v-card>

    <!-- الإحصائيات السريعة -->
    <v-card elevation="1" rounded="0" class="mx-4 mt-4 mb-2">
      <v-list density="compact" class="pa-2">
        <v-list-item>
          <template #prepend>
            <v-icon icon="mdi-account-group" color="primary" size="small" />
          </template>
          <v-list-item-title class="text-body-2">المستخدمين</v-list-item-title>
          <template #append>
            <v-chip size="x-small" color="primary" variant="flat">
              {{ dataStore.totalUsers }}
            </v-chip>
          </template>
        </v-list-item>
        
        <v-list-item>
          <template #prepend>
            <v-icon icon="mdi-post" color="secondary" size="small" />
          </template>
          <v-list-item-title class="text-body-2">المقالات</v-list-item-title>
          <template #append>
            <v-chip size="x-small" color="secondary" variant="flat">
              {{ dataStore.totalPosts }}
            </v-chip>
          </template>
        </v-list-item>
        
        <v-list-item>
          <template #prepend>
            <v-icon icon="mdi-image-album" color="success" size="small" />
          </template>
          <v-list-item-title class="text-body-2">الألبومات</v-list-item-title>
          <template #append>
            <v-chip size="x-small" color="success" variant="flat">
              {{ dataStore.totalAlbums }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- قائمة الصفحات الرئيسية -->
    <v-list density="comfortable" class="pa-2">
      <v-list-subheader class="text-caption text-medium-emphasis font-weight-bold">
        التنقل الرئيسي
      </v-list-subheader>
      
      <v-list-item
        v-for="page in mainPages"
        :key="page.routeName"
        :value="currentRouteName"
        :active="currentRouteName === page.routeName"
        :prepend-icon="page.icon"
        :title="page.title"
        @click="navigateTo(page)"
        :class="{ 'v-list-item--active': currentRouteName === page.routeName }"
        class="mb-1 rounded-lg"
      >
        <template #append v-if="page.badge">
          <v-chip size="x-small" :color="page.badgeColor" variant="flat">
            {{ page.badge }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <!-- صفحات البيانات -->
    <v-list density="comfortable" class="pa-2">
      <v-list-subheader class="text-caption text-medium-emphasis font-weight-bold">
        إدارة البيانات
      </v-list-subheader>
      
      <v-list-group value="data-management">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-database">
            <template #title>
              <span class="text-body-2 font-weight-medium">قواعد البيانات</span>
            </template>
          </v-list-item>
        </template>
        
        <v-list-item
          v-for="item in dataPages"
          :key="item.routeName"
          :value="currentRouteName"
          :active="currentRouteName === item.routeName"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="navigateTo(item)"
          class="rounded-lg"
        />
      </v-list-group>
    </v-list>

    <!-- الإجراءات السريعة -->
    <v-list density="comfortable" class="pa-2">
      <v-list-subheader class="text-caption text-medium-emphasis font-weight-bold">
        إجراءات سريعة
      </v-list-subheader>
      
      <v-list-item
        prepend-icon="mdi-refresh"
        title="تحديث البيانات"
        @click="refreshAllData"
        :disabled="dataStore.isLoading"
        class="mb-1 rounded-lg"
      >
        <template #append>
          <v-progress-circular
            v-if="dataStore.isLoading"
            indeterminate
            size="16"
            width="2"
            color="primary"
          />
        </template>
      </v-list-item>
      
      <v-list-item
        :prepend-icon="uiStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        :title="uiStore.isDark ? 'الوضع الفاتح' : 'الوضع المظلم'"
        @click="toggleTheme"
        class="mb-1 rounded-lg"
      />
    </v-list>

    <!-- معلومات النظام -->
    <v-card elevation="1" rounded="0" class="mx-4 mt-4 mb-2">
      <v-list density="compact" class="pa-2">
        <v-list-item>
          <v-list-item-title class="text-caption text-center text-medium-emphasis">
            <v-icon icon="mdi-clock-outline" size="small" class="mr-1" />
            آخر تحديث: {{ formatLastUpdate(dataStore.lastUpdated) }}
          </v-list-item-title>
        </v-list-item>
        
        <v-list-item v-if="dataStore.hasError">
          <v-list-item-title class="text-caption text-center text-error">
            <v-icon icon="mdi-alert" size="small" class="mr-1" />
            هناك أخطاء في النظام
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- النسخة -->
    <div class="text-center pa-4">
      <div class="text-caption text-medium-emphasis">
        الإصدار 1.0.0
      </div>
      <div class="text-caption text-medium-emphasis">
        © 2024 Vue System
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDataStore, useUIStore } from "@/stores";

const route = useRoute();
const router = useRouter();

// استخدام الـ Stores الجديدة
const dataStore = useDataStore();
const uiStore = useUIStore();

// الحصول على اسم المسار الحالي
const currentRouteName = computed(() => route.name as string);

// الصفحات الرئيسية
const mainPages = computed(() => [
  {
    title: "لوحة التحكم",
    icon: "mdi-home",
    routeName: "home",
    description: "الصفحة الرئيسية"
  },
  {
    title: "المستخدمين",
    icon: "mdi-account-group",
    routeName: "user",
    badge: dataStore.totalUsers,
    badgeColor: "primary",
    description: "إدارة المستخدمين"
  },
  {
    title: "المقالات",
    icon: "mdi-post",
    routeName: "posts",
    badge: dataStore.totalPosts,
    badgeColor: "secondary",
    description: "إدارة المقالات"
  },
  {
    title: "الألبومات",
    icon: "mdi-image-album",
    routeName: "allalbums",
    badge: dataStore.totalAlbums,
    badgeColor: "success",
    description: "إدارة الألبومات"
  },
    {
    title: "الإعدادات",
    icon: "mdi-cog", // نفس الأيقونة في الراوتر
    routeName: "settings",
    description: "إعدادات النظام"
  }
]);

// صفحات البيانات
const dataPages = computed(() => [
  {
    title: "مقال جديد",
    icon: "mdi-pencil-plus",
    routeName: "newpost",
    description: "إنشاء مقال جديد"
  },
  {
    title: "جميع الصور",
    icon: "mdi-image-multiple",
    routeName: "allphotos",
    description: "عرض جميع الصور"
  },
  {
    title: "التعليقات",
    icon: "mdi-comment-multiple",
    routeName: "PostComments",
    description: "إدارة التعليقات"
  }
]);

// Methods
const navigateTo = (page: any) => {
  router.push({ name: page.routeName });
  uiStore.setCurrentPage(page.title);
  
  // إغلاق التنقل على الشاشات الصغيرة
  if (!window.matchMedia('(min-width: 960px)').matches) {
    uiStore.closeDrawer();
  }
  
  // إظهار إشعار للصفحة الجديدة
  uiStore.showNotification(`تم الانتقال إلى ${page.title}`, "info", 1500);
};

const refreshAllData = async () => {
  try {
    await dataStore.fetchAllData();
    uiStore.showNotification("تم تحديث جميع البيانات بنجاح", "success");
  } catch (error) {
    uiStore.showNotification("فشل في تحديث البيانات", "error");
  }
};

const toggleTheme = () => {
  uiStore.toggleTheme();
  uiStore.showNotification(
    `تم تفعيل الوضع ${uiStore.isDark ? 'المظلم' : 'الفاتح'}`,
    'info',
    2000
  );
};

const formatLastUpdate = (date: Date | null) => {
  if (!date) return 'غير متاح';
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'الآن';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} دقيقة`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ساعة`;
  return `${Math.floor(diff / 86400000)} يوم`;
};
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12);
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.v-list-item:hover:not(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transition: background-color 0.3s ease;
}

.rounded-lg {
  border-radius: 8px;
}

.v-navigation-drawer {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-card {
  border-radius: 12px;
}

.v-list-subheader {
  opacity: 0.8;
}

::v-deep(.v-list-group__items) .v-list-item {
  padding-left: 48px;
}

::v-deep(.v-list-item__prepend) {
  margin-right: 12px;
}
</style>