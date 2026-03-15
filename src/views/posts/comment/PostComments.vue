<!-- PostComments.vue -->
<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- حالة التحميل -->
    <div v-if="dataStore.isLoading && (!dataStore.currentPostComments || dataStore.currentPostComments.length === 0)" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="5"
        class="mb-4"
      />
      <div class="text-h6 text-medium-emphasis">
        جارٍ تحميل المقال والتعليقات...
      </div>
    </div>

    <!-- المحتوى الرئيسي -->
    <div v-else>
      <!-- ✅ جزء المقال -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg" class="pa-6">
            <div class="d-flex flex-column flex-md-row align-center justify-space-between gap-4 mb-6">
              <div class="d-flex align-center">
                <div class="rounded-xl bg-primary pa-3 mr-4">
                  <v-icon icon="mdi-post" size="32" color="white" />
                </div>
                <div>
                  <h1 class="text-h4 text-primary font-weight-bold">
                    المقال
                  </h1>
                  <div class="d-flex align-center mt-2">
                    <v-chip color="primary" variant="flat" size="small" class="mr-2">
                      معرف: {{ postId }}
                    </v-chip>
                    <v-chip color="secondary" variant="flat" size="small">
                      المستخدم: {{ postAuthor?.name || 'غير معروف' }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-refresh"
                  @click="loadData(postId)"
                  :loading="dataStore.isLoading"
                >
                  تحديث
                </v-btn>
                <v-btn
                  color="secondary"
                  variant="outlined"
                  prepend-icon="mdi-arrow-left"
                  @click="$router.back()"
                >
                  رجوع
                </v-btn>
              </div>
            </div>

            <!-- ✅ محتوى المقال -->
            <div v-if="currentPost" class="post-content">
              <div class="mb-4">
                <h2 class="text-h5 font-weight-bold mb-2">{{ currentPost.title }}</h2>
                <v-divider class="my-3" />
                <div class="d-flex align-center mb-4">
                  <v-avatar color="secondary" size="36" class="mr-2">
                    <span class="text-white">{{ getInitials(postAuthor?.name) }}</span>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ postAuthor?.name || 'مستخدم مجهول' }}</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ postAuthor?.email || 'بريد غير معروف' }}
                    </div>
                  </div>
                  <v-spacer />
                  <div class="text-caption text-medium-emphasis">
                    <v-icon icon="mdi-calendar" size="small" class="mr-1" />
                    {{ formatDate(new Date()) }}
                  </div>
                </div>
              </div>

              <v-card variant="outlined" class="pa-6 mb-6">
                <div class="text-body-1 line-height-2">
                  {{ currentPost.body }}
                </div>
              </v-card>

              <div class="d-flex justify-space-between align-center mt-4">
                <div class="d-flex gap-2">
                  <v-btn
                    color="primary"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-heart-outline"
                  >
                    إعجاب
                  </v-btn>
                  <v-btn
                    color="secondary"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-share-variant"
                  >
                    مشاركة
                  </v-btn>
                  <v-btn
                    color="success"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-bookmark-outline"
                  >
                    حفظ
                  </v-btn>
                </div>

                <div class="d-flex align-center">
                  <v-icon icon="mdi-comment-text" color="primary" class="mr-1" />
                  <span class="text-body-1 font-weight-medium">
                    {{ dataStore.currentPostComments?.length || 0 }} تعليق
                  </span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- ✅ رسالة الخطأ -->
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

      <!-- ✅ قسم التعليقات -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <!-- رأس قسم التعليقات -->
            <div class="pa-6 border-b">
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <div class="rounded-xl bg-indigo pa-3 mr-4">
                    <v-icon icon="mdi-comment-multiple" size="24" color="white" />
                  </div>
                  <div>
                    <h2 class="text-h5 font-weight-bold">التعليقات</h2>
                    <div class="text-body-2 text-medium-emphasis mt-1">
                      جميع التعليقات على هذا المقال
                    </div>
                  </div>
                </div>
                
                <div class="d-flex align-center">
                  <v-text-field
                    v-model="search"
                    label="بحث في التعليقات..."
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    class="mr-3"
                    style="width: 250px;"
                    clearable
                    @click:clear="search = ''"
                  />
                  <v-chip color="indigo" variant="flat" size="small">
                    {{ dataStore.currentPostComments?.length || 0 }} تعليق
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- حالة عدم وجود تعليقات -->
            <div
              v-if="!dataStore.isLoading && (!dataStore.currentPostComments || dataStore.currentPostComments.length === 0)"
              class="text-center py-12"
            >
              <v-icon icon="mdi-comment-remove" size="96" class="mb-6 text-medium-emphasis" />
              <div class="text-h5 text-medium-emphasis mb-2">
                لا توجد تعليقات
              </div>
              <div class="text-body-1 text-medium-emphasis mb-6">
                كن أول من يعلق على هذا المقال
              </div>
            </div>

            <!-- ✅ قائمة التعليقات -->
            <div v-else>
              <v-list lines="two" class="py-0">
                <v-list-item
                  v-for="(comment, index) in filteredComments"
                  :key="comment.id"
                  :class="{ 'bg-info': hoveredIndex === index }"
                  @mouseenter="hoveredIndex = index"
                  @mouseleave="hoveredIndex = null"
                  class="px-6 py-4"
                >
                  <template #prepend>
                    <v-avatar color="indigo" size="48" class="mr-4">
                      <span class="text-white text-h6">{{ getInitials(comment.name) }}</span>
                    </v-avatar>
                  </template>

                  <template #title>
                    <div class="d-flex align-center mb-1">
                      <span class="text-h6 font-weight-bold">{{ comment.name }}</span>
                      <v-chip
                        size="x-small"
                        color="indigo"
                        variant="outlined"
                        class="ml-2"
                        label
                      >
                        #{{ comment.id }}
                      </v-chip>
                      <v-spacer />
                      <span class="text-caption text-medium-emphasis">
                        {{ formatDate(new Date()) }}
                      </span>
                    </div>
                  </template>

                  <template #subtitle>
                    <div class="d-flex align-center mb-2">
                      <v-icon icon="mdi-email" size="small" class="mr-1" color="indigo" />
                      <span class="text-caption text-medium-emphasis">{{ comment.email }}</span>
                    </div>
                    
                    <v-card variant="outlined" class="pa-3 mt-2 mb-1">
                      <div class="text-body-2">
                        {{ comment.body }}
                      </div>
                    </v-card>

                    <div class="d-flex align-center mt-3">
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="primary"
                        @click="replyToComment(comment)"
                        prepend-icon="mdi-reply"
                      >
                        رد
                      </v-btn>
                      <v-btn
                        size="x-small"
                        variant="text"
                        color="grey"
                        class="ml-2"
                        @click="reportComment(comment)"
                        prepend-icon="mdi-flag-outline"
                      >
                        الإبلاغ
                      </v-btn>
                      <v-spacer />
                      <v-chip
                        size="x-small"
                        color="grey-lighten-1"
                        variant="tonal"
                        label
                      >
                        {{ formatIndex(index + 1) }}
                      </v-chip>
                    </div>
                  </template>
                </v-list-item>
              </v-list>

              <!-- ✅ لا توجد نتائج بحث -->
              <div
                v-if="search && (!filteredComments || filteredComments.length === 0)"
                class="text-center py-12"
              >
                <v-icon icon="mdi-magnify-close" size="96" class="mb-6 text-medium-emphasis" />
                <div class="text-h5 text-medium-emphasis mb-2">
                  لا توجد نتائج
                </div>
                <div class="text-body-1 text-medium-emphasis mb-6">
                  لم يتم العثور على تعليقات مطابقة لـ "{{ search }}"
                </div>
                <v-btn
                  color="primary"
                  variant="outlined"
                  @click="clearSearch"
                  prepend-icon="mdi-filter-remove"
                >
                  مسح البحث
                </v-btn>
              </div>
            </div>

            <!-- ✅ إضافة تعليق جديد -->
            <div class="border-t pa-6 bg-background">
              <div class="d-flex align-start gap-3">
                <v-avatar color="primary" size="48" class="mt-1">
                  <span class="text-white">{{ getInitials(currentUser) }}</span>
                </v-avatar>
                
                <div class="flex-grow-1">
                  <v-textarea
                    v-model="newComment"
                    label="أضف تعليقاً..."
                    variant="outlined"
                    rows="3"
                    hide-details
                    auto-grow
                    class="mb-3"
                    :placeholder="replyTo ? `الرد على ${replyTo.name}...` : 'اكتب تعليقك هنا...'"
                  />
                  
                  <div class="d-flex justify-space-between align-center">
                    <div v-if="replyTo" class="d-flex align-center">
                      <v-chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        closable
                        @click:close="cancelReply"
                        class="mr-2"
                      >
                        رد على {{ replyTo.name }}
                      </v-chip>
                    </div>
                    <v-spacer />
                    <div class="d-flex gap-2">
                      <v-btn
                        color="secondary"
                        variant="outlined"
                        @click="cancelReply"
                        :disabled="!replyTo"
                      >
                        إلغاء
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="flat"
                        @click="addComment"
                        :disabled="!newComment.trim()"
                        :loading="addingComment"
                        prepend-icon="mdi-send"
                      >
                        نشر التعليق
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useDataStore, useUIStore } from "@/stores/index";

const route = useRoute();
const dataStore = useDataStore();
const uiStore = useUIStore();

// Local state
const postId = ref(Number(route.params.postId));
const hoveredIndex = ref<number | null>(null);
const search = ref("");
const newComment = ref("");
const addingComment = ref(false);
const replyTo = ref<any>(null);

// ✅ متغيرات محسوبة للمقال
const currentPost = computed(() => {
  return dataStore.posts?.find(post => post.id === postId.value);
});

const postAuthor = computed(() => {
  if (!currentPost.value) return null;
  return dataStore.users?.find(user => user.id === currentPost.value.userId);
});

const currentUser = computed(() => {
  // هنا يمكنك إرجاع اسم المستخدم الحالي من الـ store
  return "أنت";
});

// ✅ البحث المصفى المعدل
const filteredComments = computed(() => {
  if (!dataStore.currentPostComments || !Array.isArray(dataStore.currentPostComments)) {
    return [];
  }
  
  if (!search.value.trim()) return dataStore.currentPostComments;
  
  const searchTerm = search.value.toLowerCase().trim();
  return dataStore.currentPostComments.filter(comment => {
    if (!comment) return false;
    
    const nameMatch = comment.name?.toLowerCase().includes(searchTerm) || false;
    const emailMatch = comment.email?.toLowerCase().includes(searchTerm) || false;
    const bodyMatch = comment.body?.toLowerCase().includes(searchTerm) || false;
    
    return nameMatch || emailMatch || bodyMatch;
  });
});

// ✅ Methods
const loadData = async (id: number) => {
  if (!id || isNaN(id)) return;
  
  try {
    // تحميل المقال إذا لم يكن محملاً
    if (dataStore.posts.length === 0) {
      await dataStore.fetchPosts();
    }
    
    // تحميل المستخدمين إذا لم يكونوا محمّلين
    if (dataStore.users.length === 0) {
      await dataStore.fetchUsers();
    }
    
    // تحميل التعليقات
    await dataStore.fetchCommentsByPostId(id);
    
    uiStore.showNotification("تم تحميل البيانات بنجاح", "success");
  } catch (error) {
    uiStore.showNotification("فشل في تحميل البيانات", "error");
  }
};

const addComment = async () => {
  if (!newComment.value.trim()) return;
  
  addingComment.value = true;
  
  try {
    const commentBody = replyTo.value 
      ? `@${replyTo.value.name} ${newComment.value.trim()}`
      : newComment.value.trim();
    
    const mockComment = {
      id: Date.now(),
      postId: postId.value,
      name: currentUser.value,
      email: "current@user.com",
      body: commentBody,
      replyTo: replyTo.value?.id || null
    };
    
    if (dataStore.currentPostComments && Array.isArray(dataStore.currentPostComments)) {
      dataStore.currentPostComments.unshift(mockComment);
    }
    
    uiStore.showNotification("تمت إضافة التعليق بنجاح", "success");
    newComment.value = "";
    replyTo.value = null;
  } catch (error) {
    uiStore.showNotification("فشل في إضافة التعليق", "error");
  } finally {
    addingComment.value = false;
  }
};

const replyToComment = (comment: any) => {
  replyTo.value = comment;
  newComment.value = "";
  uiStore.showNotification(`أنت الآن ترد على ${comment.name}`, "info");
};

const cancelReply = () => {
  replyTo.value = null;
};

const reportComment = (comment: any) => {
  uiStore.showNotification(`تم الإبلاغ عن تعليق ${comment.name}`, "warning");
};

const clearSearch = () => {
  search.value = "";
};

const getInitials = (name: string | undefined) => {
  if (!name) return '??';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatIndex = (index: number) => {
  return `التعليق ${index}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Lifecycle
onMounted(() => {
  loadData(postId.value);
});

// Watchers
watch(
  () => route.params.postId,
  (newId) => {
    const id = newId ? Number(newId) : 0;
    if (id > 0) {
      postId.value = id;
      loadData(id);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.post-content {
  line-height: 1.8;
}

.line-height-2 {
  line-height: 2;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  transition: background-color 0.3s ease;
}

::v-deep(.v-list-item__prepend) {
  align-items: start;
  margin-top: 8px;
}

.bg-grey-lighten-4 {
  background-color: rgba(var(--v-theme-grey-lighten-4));
}
</style>