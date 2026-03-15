<!-- UserInformation.vue -->
<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- حالة التحميل -->
    <div v-if="loading && !user" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="5"
        class="mb-4"
      />
      <div class="text-h6 text-medium-emphasis">
        جارٍ تحميل معلومات المستخدم...
      </div>
    </div>

    <!-- المستخدم غير موجود -->
    <div v-else-if="!user && !loading" class="text-center py-12">
      <v-icon icon="mdi-account-question" size="96" class="mb-6 text-medium-emphasis" />
      <div class="text-h5 text-medium-emphasis mb-2">
        المستخدم غير موجود
      </div>
      <div class="text-body-1 text-medium-emphasis mb-6">
        لم يتم العثور على المستخدم بالمعرف المطلوب
      </div>
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-arrow-left"
        @click="$router.push({ name: 'user' })"
      >
        العودة لقائمة المستخدمين
      </v-btn>
    </div>

    <!-- المحتوى الرئيسي -->
    <div v-else-if="user">
      <!-- معلومات المستخدم -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg" class="pa-6">
            <div class="d-flex flex-column flex-md-row align-start justify-space-between gap-6">
              <!-- الصورة والمعلومات الأساسية -->
              <div class="d-flex flex-column flex-md-row align-start gap-6">
                <v-avatar size="120" color="primary" class="elevation-4">
                  <span class="text-white text-h2 font-weight-bold">
                    {{ getInitials(user.name) }}
                  </span>
                </v-avatar>
                
                <div>
                  <h1 class="text-h3 text-primary font-weight-bold mb-2">
                    {{ user.name }}
                  </h1>
                  <div class="d-flex flex-wrap gap-4 mb-4">
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-account" color="primary" class="mr-2" />
                      <span class="text-body-1">@{{ user.username }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-email" color="primary" class="mr-2" />
                      <a :href="`mailto:${user.email}`" class="text-body-1 text-decoration-none">
                        {{ user.email }}
                      </a>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-phone" color="primary" class="mr-2" />
                      <a :href="`tel:${user.phone}`" class="text-body-1 text-decoration-none">
                        {{ user.phone }}
                      </a>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-web" color="primary" class="mr-2" />
                      <a 
                        :href="user.website.startsWith('http') ? user.website : `https://${user.website}`" 
                        target="_blank"
                        class="text-body-1 text-decoration-none"
                      >
                        {{ user.website }}
                      </a>
                    </div>
                  </div>
                  
                  <!-- معلومات الشركة -->
                  <v-card elevation="1" rounded="lg" class="pa-4 mb-4">
                    <div class="d-flex align-center mb-3">
                      <v-icon icon="mdi-office-building" color="secondary" class="mr-3" />
                      <div class="text-h6 font-weight-bold">{{ user.company?.name || 'غير محدد' }}</div>
                    </div>
                    <div class="text-body-2">{{ user.company?.catchPhrase || 'لا يوجد شعار' }}</div>
                    <div class="text-caption text-medium-emphasis">{{ user.company?.bs || 'لا يوجد وصف' }}</div>
                  </v-card>
                </div>
              </div>

              <!-- الإحصائيات -->
              <div class="d-flex flex-column gap-4">
                <v-card elevation="1" rounded="lg" class="pa-4">
                  <div class="text-center mb-3">
                    <div class="text-caption text-medium-emphasis">المقالات</div>
                    <div class="text-h3 font-weight-bold text-primary">
                      {{ userPosts.length }}
                    </div>
                  </div>
                </v-card>
                
                <v-card elevation="1" rounded="lg" class="pa-4">
                  <div class="text-center mb-3">
                    <div class="text-caption text-medium-emphasis">الألبومات</div>
                    <div class="text-h3 font-weight-bold text-secondary">
                      {{ userAlbums.length }}
                    </div>
                  </div>
                </v-card>
                
                <v-btn
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-refresh"
                  @click="refreshUserData"
                  :loading="dataStore.isLoading"
                >
                  تحديث البيانات
                </v-btn>
              </div>
            </div>

            <!-- العنوان -->
            <v-card elevation="1" rounded="lg" class="pa-4 mt-6">
              <div class="d-flex align-center mb-3">
                <v-icon icon="mdi-map-marker" color="info" class="mr-3" />
                <div class="text-h6 font-weight-bold">العنوان</div>
              </div>
              <div class="text-body-1">
                {{ user.address?.street }}, {{ user.address?.suite }}
              </div>
              <div class="text-body-1">
                {{ user.address?.city }}, {{ user.address?.zipcode }}
              </div>
              <div class="text-caption text-medium-emphasis mt-2">
                الإحداثيات: {{ user.address?.geo?.lat }}, {{ user.address?.geo?.lng }}
              </div>
            </v-card>
          </v-card>
        </v-col>
      </v-row>

      <!-- رسالة الخطأ -->
      <v-alert
        v-if="dataStore.hasError"
        type="error"
        variant="tonal"
        border="start"
        class="mb-6"
        closable
        @click:close="dataStore.clearError()"
      >
        <template #prepend>
          <v-icon icon="mdi-alert-circle" />
        </template>
        <strong>حدث خطأ:</strong> {{ dataStore.error }}
      </v-alert>

      <!-- المقالات والألبومات والمهام -->
      <v-row>
        <!-- المقالات -->
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" rounded="lg" class="h-100">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon icon="mdi-post" class="mr-2" />
                المقالات
              </v-toolbar-title>
              <v-spacer />
              <v-chip color="white" variant="flat" size="small">
                {{ userPosts.length }}
              </v-chip>
            </v-toolbar>
            
            <v-card-text class="pa-4">
              <div v-if="loading && !userPosts.length" class="text-center py-6">
                <v-progress-circular indeterminate size="32" />
              </div>
              
              <div v-else-if="!userPosts.length" class="text-center py-6">
                <v-icon icon="mdi-post-off" size="48" class="mb-3 text-medium-emphasis" />
                <div class="text-h6 text-medium-emphasis">لا توجد مقالات</div>
              </div>
              
              <v-list v-else lines="two" density="comfortable">
                <v-list-item
                  v-for="post in userPosts.slice(0, 5)"
                  :key="post.id"
                  @click="$router.push({ name: 'PostComments', params: { postId: post.id } })"
                  class="cursor-pointer mb-2 rounded-lg"
                >
                  <template #prepend>
                    <v-icon icon="mdi-file-document" color="primary" />
                  </template>
                  
                  <v-list-item-title class="text-body-1 font-weight-medium">
                    {{ truncateText(post.title, 40) }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle class="text-caption">
                    {{ truncateText(post.body, 60) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
              
              <div v-if="userPosts.length > 5" class="text-center mt-4">
                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  @click="postsExpanded = !postsExpanded"
                >
                  {{ postsExpanded ? 'عرض أقل' : `عرض ${userPosts.length - 5} مقال إضافي` }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- الألبومات -->
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" rounded="lg" class="h-100">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon icon="mdi-image-album" class="mr-2" />
                الألبومات
              </v-toolbar-title>
              <v-spacer />
              <v-chip color="white" variant="flat" size="small">
                {{ userAlbums.length }}
              </v-chip>
            </v-toolbar>
            
            <v-card-text class="pa-4">
              <div v-if="loading && !userAlbums.length" class="text-center py-6">
                <v-progress-circular indeterminate size="32" />
              </div>
              
              <div v-else-if="!userAlbums.length" class="text-center py-6">
                <v-icon icon="mdi-folder-off" size="48" class="mb-3 text-medium-emphasis" />
                <div class="text-h6 text-medium-emphasis">لا توجد ألبومات</div>
              </div>
              
              <v-list v-else lines="two" density="comfortable">
                <v-list-item
                  v-for="album in userAlbums.slice(0, 5)"
                  :key="album.id"
                  @click="$router.push({ 
                    name: 'albumPhotos', 
                    params: { id: user.id, albumId: album.id }
                  })"
                  class="cursor-pointer mb-2 rounded-lg"
                >
                  <template #prepend>
                    <v-icon icon="mdi-folder-image" color="secondary" />
                  </template>
                  
                  <v-list-item-title class="text-body-1 font-weight-medium">
                    {{ truncateText(album.title, 40) }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle class="text-caption">
                    {{ getPhotosCount(album.id) }} صورة
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
              
              <div v-if="userAlbums.length > 5" class="text-center mt-4">
                <v-btn
                  color="secondary"
                  variant="text"
                  size="small"
                  @click="albumsExpanded = !albumsExpanded"
                >
                  {{ albumsExpanded ? 'عرض أقل' : `عرض ${userAlbums.length - 5} ألبوم إضافي` }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- المهام -->
        <v-col cols="12" lg="4">
          <UserTodos :userId="user.id" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDataStore, useUIStore } from "@/stores";
import UserTodos from "@/views/UserInfo/TodoView.vue";

const route = useRoute();
const router = useRouter();

// استخدام الـ Stores الجديدة
const dataStore = useDataStore();
const uiStore = useUIStore();

// Local state
const postsExpanded = ref(false);
const albumsExpanded = ref(false);

// الحصول على معرف المستخدم من الـ route
const userId = computed(() => Number(route.params.id));

// الحصول على بيانات المستخدم
const user = computed(() => dataStore.getUserById(userId.value));

// حالة التحميل الشاملة
const loading = computed(() => 
  dataStore.isLoading && !user.value
);

// الحصول على مقالات المستخدم
const userPosts = computed(() => 
  dataStore.getPostsByUserId(userId.value)
);

// الحصول على ألبومات المستخدم
const userAlbums = computed(() => 
  dataStore.getAlbumsByUserId(userId.value)
);

// Methods
const refreshUserData = async () => {
  try {
    await Promise.all([
      dataStore.fetchUserById(userId.value),
      dataStore.fetchPosts(true),
      dataStore.fetchAlbums(true)
    ]);
    uiStore.showNotification("تم تحديث بيانات المستخدم بنجاح", "success");
  } catch (error) {
    uiStore.showNotification("فشل في تحديث بيانات المستخدم", "error");
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const getPhotosCount = (albumId: number) => {
  return dataStore.getPhotosByAlbumId(albumId).length;
};

// تحميل البيانات
const loadUserData = async () => {
  if (!userId.value || isNaN(userId.value)) {
    uiStore.showNotification("معرف المستخدم غير صالح", "error");
    return;
  }

  try {
    await dataStore.fetchUserById(userId.value);
    await dataStore.fetchPosts();
    await dataStore.fetchAlbums();
  } catch (error) {
    uiStore.showNotification("فشل في تحميل بيانات المستخدم", "error");
  }
};

// Lifecycle
onMounted(() => {
  loadUserData();
});

// Watchers
watch(
  () => route.params.id,
  () => {
    loadUserData();
  }
);
</script>

<style scoped>
.h-100 {
  height: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transition: background-color 0.3s ease;
}

.text-decoration-none {
  text-decoration: none;
}

.v-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>