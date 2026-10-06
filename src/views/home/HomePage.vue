<template>
  <v-progress-linear v-if="loading" indeterminate color="primary" height="3" />

  <!-- الصفحة الرئيسية -->
  <v-container fluid class="pa-4 pa-md-6">
    <!-- العنوان الرئيسي -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-icon
            icon="mdi-home-analytics"
            size="x-large"
            color="primary"
            class="mr-3"
          />
          <div>
            <h1 class="text-h4 text-primary font-weight-bold">
              لوحة التحكم الرئيسية
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mt-1">
              نظرة عامة على جميع بيانات التطبيق
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- إحصائيات سريعة -->
    <v-row class="mb-8">
      <v-col cols="12" md="3" v-for="stat in quickStats" :key="stat.title">
        <v-card
          class="text-center pa-4 h-100"
          elevation="2"
          rounded="lg"
          :color="stat.color"
          variant="tonal"
          @click="router.push(stat.route)"
          hover
        >
          <v-icon size="40" :color="stat.iconColor" class="mb-3">
            {{ stat.icon }}
          </v-icon>

          <v-card-title class="justify-center text-h6 font-weight-medium">
            {{ stat.title }}
          </v-card-title>

          <v-card-text class="text-h3 font-weight-bold">
            {{ stat.count }}
          </v-card-text>

          <v-card-subtitle class="text-caption">
            {{ stat.subtitle }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- بطاقات البيانات -->
    <v-row justify="center" align="stretch" class="ga-6 mb-8">
      <v-col cols="12" md="6" v-for="card in cards" :key="card.title">
        <v-card
          class="pa-6 h-100"
          elevation="4"
          rounded="xl"
          hover
          @click="router.push(card.route)"
        >
          <div class="d-flex align-center mb-4">
            <div class="rounded-xl pa-3 mr-4" :style="{ backgroundColor: `var(--v-${card.color}-base)` }">
              <v-icon size="32" color="white">
                {{ card.icon }}
              </v-icon>
            </div>
            <div>
              <v-card-title class="pa-0 text-h5 font-weight-bold">
                {{ card.title }}
              </v-card-title>
              <v-card-subtitle class="pa-0 text-caption text-medium-emphasis">
                {{ card.description }}
              </v-card-subtitle>
            </div>
          </div>

          <v-card-text class="text-center">
            <div class="text-h2 font-weight-bold mb-2">
              {{ card.count }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ card.unit }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              :color="card.color"
              variant="flat"
              block
              @click.stop="router.push(card.route)"
            >
              <v-icon start>{{ card.actionIcon }}</v-icon>
              {{ card.actionText }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- آخر التحديثات -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg" class="pa-6">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <v-card-title class="pa-0 text-h5 font-weight-bold">
                آخر التحديثات
              </v-card-title>
              <v-card-subtitle class="pa-0 text-caption text-medium-emphasis">
                آخر البيانات المضافة والمحدثة
              </v-card-subtitle>
            </div>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-refresh"
              @click="refreshAllData"
              :loading="dataStore.isLoading"
            >
              تحديث الكل
            </v-btn>
          </div>

          <v-divider class="mb-4" />

          <v-row>
            <v-col cols="12" md="4">
              <div class="d-flex align-center mb-4">
                <v-icon icon="mdi-account-group" color="primary" class="mr-3" />
                <div>
                  <div class="text-subtitle-1 font-weight-medium">آخر المستخدمين</div>
                  <div class="text-caption text-medium-emphasis">
                    تم تحديث {{ dataStore.users.length }} مستخدم
                  </div>
                </div>
              </div>
              <v-list lines="two" density="compact">
                <v-list-item
                  v-for="user in latestUsers"
                  :key="user.id"
                  :title="user.name"
                  :subtitle="user.email"
                  @click="router.push({ name: 'userDetails', params: { id: user.id } })"
                  class="cursor-pointer"
                >
                  <template #prepend>
                    <v-avatar size="36" color="surface-variant">
                      <v-icon icon="mdi-account" />
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" md="4">
              <div class="d-flex align-center mb-4">
                <v-icon icon="mdi-post" color="secondary" class="mr-3" />
                <div>
                  <div class="text-subtitle-1 font-weight-medium">آخر المقالات</div>
                  <div class="text-caption text-medium-emphasis">
                    تم تحديث {{ dataStore.posts.length }} مقال
                  </div>
                </div>
              </div>
              <v-list lines="two" density="compact">
                <v-list-item
                  v-for="post in latestPosts"
                  :key="post.id"
                  :title="post.title.substring(0, 40) + '...'"
                  :subtitle="`بواسطة: ${getUserName(post.userId)}`"
                  @click="router.push({ name: 'PostComments', params: { postId: post.id } })"
                  class="cursor-pointer"
                >
                  <template #prepend>
                    <v-avatar size="36" color="surface-variant">
                      <v-icon icon="mdi-file-document" />
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" md="4">
              <div class="d-flex align-center mb-4">
                <v-icon icon="mdi-image-album" color="success" class="mr-3" />
                <div>
                  <div class="text-subtitle-1 font-weight-medium">آخر الألبومات</div>
                  <div class="text-caption text-medium-emphasis">
                    تم تحديث {{ dataStore.albums.length }} ألبوم
                  </div>
                </div>
              </div>
              <v-list lines="two" density="compact">
                <v-list-item
                  v-for="album in latestAlbums"
                  :key="album.id"
                  :title="album.title.substring(0, 40) + '...'"
                  :subtitle="`بواسطة: ${getUserName(album.userId)}`"
                  @click="router.push({ name: 'allphotos', params: { albumId: album.id } })"
                  class="cursor-pointer"
                >
                  <template #prepend>
                    <v-avatar size="36" color="surface-variant">
                      <v-icon icon="mdi-folder-image" />
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- رسالة الخطأ -->
    <v-alert
      v-if="dataStore.hasError"
      type="error"
      variant="tonal"
      border="start"
      class="mt-6"
      closable
      @click:close="dataStore.clearError()"
    >
      <template #prepend>
        <v-icon icon="mdi-alert-circle" />
      </template>
      <strong>حدث خطأ:</strong> {{ dataStore.error }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDataStore, useUIStore } from "@/stores";

const router = useRouter();

// استخدام الـ Stores الجديدة
const dataStore = useDataStore();
const uiStore = useUIStore();

// حالة التحميل
const loading = computed(() =>
  dataStore.isLoading &&
  !dataStore.users.length &&
  !dataStore.posts.length &&
  !dataStore.albums.length
);

// إحصائيات سريعة
const quickStats = computed(() => [
  {
    title: "المستخدمين",
    icon: "mdi-account-group",
    iconColor: "primary",
    count: dataStore.totalUsers,
    subtitle: "مستخدم مسجل",
    color: "primary",
    route: { name: "user" }
  },
  {
    title: "المقالات",
    icon: "mdi-post",
    iconColor: "secondary",
    count: dataStore.totalPosts,
    subtitle: "مقال منشور",
    color: "secondary",
    route: { path: "/posts" }
  },
  {
    title: "الألبومات",
    icon: "mdi-image-album",
    iconColor: "success",
    count: dataStore.totalAlbums,
    subtitle: "ألبوم للصور",
    color: "success",
    route: { name: "allalbums" }
  },
  {
    title: "الصور",
    icon: "mdi-image-multiple",
    iconColor: "info",
    count: dataStore.totalPhotos,
    subtitle: "صورة مخزنة",
    color: "info",
    route: { name: "allalbums" }
  }
]);

// بطاقات البيانات الرئيسية
const cards = computed(() => [
  {
    title: "إدارة المستخدمين",
    description: "عرض وتعديل وإدارة جميع المستخدمين",
    icon: "mdi-account-group",
    color: "primary",
    count: dataStore.totalUsers,
    unit: "مستخدم",
    actionIcon: "mdi-eye",
    actionText: "عرض المستخدمين",
    route: { name: "user" }
  },
  {
    title: "المقالات والمنشورات",
    description: "إدارة جميع المقالات والتعليقات",
    icon: "mdi-post",
    color: "secondary",
    count: dataStore.totalPosts,
    unit: "مقال",
    actionIcon: "mdi-post",
    actionText: "عرض المقالات",
    route: { path: "/posts" }
  },
  {
    title: "ألبومات الصور",
    description: "إدارة وتنظيم جميع ألبومات الصور",
    icon: "mdi-image-album",
    color: "success",
    count: dataStore.totalAlbums,
    unit: "ألبوم",
    actionIcon: "mdi-folder-open",
    actionText: "عرض الألبومات",
    route: { name: "allalbums" }
  }
]);

// أحدث البيانات
const latestUsers = computed(() =>
  [...dataStore.users].sort((a, b) => b.id - a.id).slice(0, 3)
);

const latestPosts = computed(() =>
  [...dataStore.posts].sort((a, b) => b.id - a.id).slice(0, 3)
);

const latestAlbums = computed(() =>
  [...dataStore.albums].sort((a, b) => b.id - a.id).slice(0, 3)
);

// دالة مساعدة للحصول على اسم المستخدم
const getUserName = (userId: number) => {
  const user = dataStore.users.find(u => u.id === userId);
  return user ? user.name : "مستخدم غير معروف";
};

// تحديث جميع البيانات
const refreshAllData = async () => {
  try {
    await dataStore.fetchAllData();
    uiStore.showNotification("تم تحديث جميع البيانات بنجاح", "success");
  } catch (error) {
    uiStore.showNotification("فشل في تحديث البيانات", "error");
  }
};

// Lifecycle
onMounted(async () => {
  if (!dataStore.users.length || !dataStore.posts.length || !dataStore.albums.length) {
    await refreshAllData();
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.h-100 {
  height: 100%;
}

.v-card--hover:hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>
