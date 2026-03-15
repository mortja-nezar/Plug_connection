<!-- PostsView.vue -->
<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- العنوان الرئيسي -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center">
            <v-icon 
              icon="mdi-post" 
              size="x-large" 
              color="primary" 
              class="mr-3"
            />
            <div>
              <h1 class="text-h4 text-primary font-weight-bold">
                إدارة المقالات
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis mt-1">
                عرض وتعديل وإدارة جميع المقالات
              </p>
            </div>
          </div>
          
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-refresh"
            @click="refreshPosts"
            :loading="dataStore.isLoading"
          >
            تحديث
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- البحث والإحصائيات -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="lg" class="pa-4">
          <div class="d-flex flex-column flex-md-row align-center gap-4">
            <v-text-field
              v-model="search"
              label="ابحث في المقالات..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              class="flex-grow-1"
              clearable
            />
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-plus"
              @click="goToAddPost"
            >
              مقال جديد
            </v-btn>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg" class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">إجمالي المقالات</div>
              <div class="text-h4 font-weight-bold text-primary">
                {{ dataStore.totalPosts }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ filteredPosts.length }} نتيجة للبحث
              </div>
            </div>
            <v-icon icon="mdi-post" size="48" color="primary" class="opacity-50" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- حالة التحميل -->
    <v-skeleton-loader
      v-if="dataStore.isLoading && !dataStore.posts.length"
      type="card"
      class="rounded-lg mb-4"
      v-for="n in 3"
      :key="n"
    />

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

    <!-- حالة عدم وجود مقالات -->
    <v-card
      v-else-if="!dataStore.posts.length && !dataStore.isLoading"
      elevation="2"
      rounded="lg"
      class="text-center py-12"
    >
      <v-icon icon="mdi-post-off" size="96" class="mb-6 text-medium-emphasis" />
      <div class="text-h5 text-medium-emphasis mb-2">
        لا توجد مقالات
      </div>
      <div class="text-body-1 text-medium-emphasis mb-6">
        لم يتم إنشاء أي مقالات حتى الآن
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="goToAddPost"
      >
        إنشاء أول مقال
      </v-btn>
    </v-card>

    <!-- قائمة المقالات -->
    <div v-else>
      <!-- لا توجد نتائج بحث -->
      <v-card
        v-if="search && !filteredPosts.length"
        elevation="2"
        rounded="lg"
        class="text-center py-12 mb-6"
      >
        <v-icon icon="mdi-magnify-close" size="96" class="mb-6 text-medium-emphasis" />
        <div class="text-h5 text-medium-emphasis mb-2">
          لا توجد نتائج
        </div>
        <div class="text-body-1 text-medium-emphasis mb-6">
          لم يتم العثور على مقالات مطابقة لـ "{{ search }}"
        </div>
        <v-btn
          color="primary"
          variant="outlined"
          @click="clearSearch"
          prepend-icon="mdi-filter-remove"
        >
          مسح البحث
        </v-btn>
      </v-card>

      <!-- المقالات -->
      <v-expansion-panels v-else multiple v-model="openPanels">
        <v-expansion-panel
          v-for="post in filteredPosts"
          :key="post.id"
          :value="post.id"
          rounded="lg"
          class="mb-4"
          elevation="2"
        >
          <v-expansion-panel-title expand-icon="mdi-chevron-down" collapse-icon="mdi-chevron-up">
            <div class="d-flex align-center w-100">
              <v-avatar size="40" color="primary" class="mr-4">
                <v-icon icon="mdi-post" color="white" />
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold">{{ post.title }}</div>
                <div class="text-caption text-medium-emphasis">
                  بواسطة: {{ getUserName(post.userId) }} • ID: {{ post.id }}
                </div>
              </div>

              <v-chip size="small" color="primary" variant="flat" class="ml-2">
                {{ dataStore.getCommentsByPostIdMap(post.id).length }} تعليق
              </v-chip>

              <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-comment-multiple"
                @click="showComments(post)"
                size="small"
                class="ml-2"
              >
                عرض التعليقات
              </v-btn>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div class="pa-4">
              <div class="text-body-1" style="white-space: pre-line;">{{ post.body }}</div>
              <v-divider class="my-4" />
              <div class="d-flex align-center justify-space-between">
                <div class="text-caption text-medium-emphasis">
                  المستخدم: {{ getUserName(post.userId) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  معرف المقال: {{ post.id }}
                </div>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- Dialog عرض التعليقات -->
    <v-dialog v-model="commentsDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon icon="mdi-comment-multiple" class="mr-2" />
          <span class="text-h6">تعليقات: {{ activePost?.title }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text class="pt-4" style="max-height: 400px; overflow-y: auto;">
          <v-list v-if="postComments.length">
            <v-list-item
              v-for="comment in postComments"
              :key="comment.id"
              class="mb-2"
              two-line
            >
              <v-list-item-title class="font-weight-bold">{{ comment.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-body-2">{{ comment.body }}</v-list-item-subtitle>
              <v-list-item-subtitle class="text-caption text-medium-emphasis">{{ comment.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div v-else class="text-center text-medium-emphasis py-6">
            لا توجد تعليقات
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="primary" @click="commentsDialog = false">إغلاق</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDataStore, useUIStore } from "@/stores";

const router = useRouter();
const dataStore = useDataStore();
const uiStore = useUIStore();

// Local state
const search = ref("");
const openPanels = ref<number[]>([]);
const commentsDialog = ref(false);
const activePost = ref<any>(null);
const postComments = ref<any[]>([]);

// Computed
const filteredPosts = computed(() => {
  if (!search.value) return dataStore.posts;
  const term = search.value.toLowerCase();
  return dataStore.posts.filter(post =>
    post.title.toLowerCase().includes(term) ||
    post.body.toLowerCase().includes(term) ||
    getUserName(post.userId).toLowerCase().includes(term)
  );
});

// Methods
const refreshPosts = async () => {
  try {
    await dataStore.fetchPosts();
    uiStore.showNotification("تم تحديث المقالات بنجاح", "success");
  } catch {
    uiStore.showNotification("فشل في تحديث المقالات", "error");
  }
};

const goToAddPost = () => router.push({ name: "newpost" });

const clearSearch = () => search.value = "";

const getUserName = (userId: number) => {
  const user = dataStore.users.find(u => u.id === userId);
  return user ? user.name : "مستخدم غير معروف";
};

// Show comments dialog
const showComments = async (post: any) => {
  activePost.value = post;
  try {
    const comments = await dataStore.fetchCommentsByPostId(post.id);
    postComments.value = comments;
    commentsDialog.value = true;
  } catch {
    uiStore.showNotification("فشل في تحميل التعليقات", "error");
  }
};

// Lifecycle
onMounted(async () => {
  if (!dataStore.posts.length) await dataStore.fetchPosts();
  if (!dataStore.users.length) await dataStore.fetchUsers();

  // Preload comments
  for (const post of dataStore.posts) {
    const comments = await dataStore.fetchCommentsByPostId(post.id);
    dataStore.setComments(post.id, comments);
  }
});
</script>

<style scoped>
.w-100 { width: 100%; }
.opacity-50 { opacity: 0.5; }
::v-deep(.v-expansion-panel-title) { min-height: 72px; }
::v-deep(.v-expansion-panel-text__wrapper) { padding: 0; }
</style>
