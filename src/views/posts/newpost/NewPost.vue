<!-- NewPost.vue -->
<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- حالة التحميل -->
    <div v-if="loading && !dataStore.users.length" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="5"
        class="mb-4"
      />
      <div class="text-h6 text-medium-emphasis">
        جارٍ تحميل البيانات...
      </div>
    </div>

    <!-- نموذج إنشاء مقال جديد -->
    <div v-else>
      <!-- العنوان -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-icon 
              icon="mdi-pencil-plus" 
              size="x-large" 
              color="primary" 
              class="mr-3"
            />
            <div>
              <h1 class="text-h4 text-primary font-weight-bold">
                إنشاء مقال جديد
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis mt-1">
                اكتب مقالاً جديداً ومشاركته مع المستخدمين
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" xl="8" lg="10" md="12">
          <v-card elevation="2" rounded="lg" class="overflow-hidden">
            <!-- رأس البطاقة -->
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-h6 text-white">
                نموذج المقال الجديد
              </v-toolbar-title>
              <v-spacer />
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                color="white"
                @click="$router.back()"
              />
            </v-toolbar>

            <v-card-text class="pa-6">
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

              <!-- رسالة النجاح -->
              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                border="start"
                class="mb-6"
              >
                <template #prepend>
                  <v-icon icon="mdi-check-circle" />
                </template>
                {{ successMessage }}
              </v-alert>

              <!-- نموذج المقال -->
              <v-form @submit.prevent="savePost">
                <v-row>
                  <!-- اختيار المستخدم -->
                  <v-col cols="12" md="6">
                    <v-card elevation="1" rounded="lg" class="pa-4 h-100">
                      <div class="d-flex align-center mb-4">
                        <v-icon icon="mdi-account" color="primary" class="mr-3" />
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">المستخدم</div>
                          <div class="text-caption text-medium-emphasis">
                            اختر المستخدم الذي سينشر المقال
                          </div>
                        </div>
                      </div>
                      
                      <v-select
                        v-model="post.userId"
                        :items="usersOptions"
                        item-title="name"
                        item-value="id"
                        label="اختر مستخدم"
                        :error-messages="userIdError"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-account-circle"
                        clearable
                        required
                        @update:model-value="clearErrors"
                      >
                        <template #item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template #prepend>
                              <v-avatar size="36" color="surface-variant">
                                <v-icon icon="mdi-account" />
                              </v-avatar>
                            </template>
                            <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.raw.email }}</v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-alert
                        v-if="selectedUser"
                        type="info"
                        variant="tonal"
                        density="compact"
                        class="mt-4"
                      >
                        <template #prepend>
                          <v-icon icon="mdi-information" size="small" />
                        </template>
                        <div class="text-caption">
                          المستخدم المحدد: <strong>{{ selectedUser.name }}</strong>
                          <br>
                          البريد: {{ selectedUser.email }}
                        </div>
                      </v-alert>
                    </v-card>
                  </v-col>

                  <!-- إحصائيات سريعة -->
                  <v-col cols="12" md="6">
                    <v-card elevation="1" rounded="lg" class="pa-4 h-100">
                      <div class="d-flex align-center mb-4">
                        <v-icon icon="mdi-chart-bar" color="primary" class="mr-3" />
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">إحصائيات</div>
                          <div class="text-caption text-medium-emphasis">
                            معلومات عن المقالات الحالية
                          </div>
                        </div>
                      </div>
                      
                      <div class="d-flex justify-space-between align-center mb-4">
                        <div>
                          <div class="text-caption text-medium-emphasis">إجمالي المقالات</div>
                          <div class="text-h4 font-weight-bold text-primary">
                            {{ dataStore.totalPosts }}
                          </div>
                        </div>
                        <v-icon icon="mdi-post" size="48" color="primary" class="opacity-50" />
                      </div>

                      <v-divider class="my-4" />

                      <div class="text-caption text-medium-emphasis mb-2">
                        مقالات المستخدم المحدد:
                      </div>
                      <div class="text-h5 font-weight-bold">
                        {{ userPostsCount }}
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row class="mt-4">
                  <!-- عنوان المقال -->
                  <v-col cols="12">
                    <v-card elevation="1" rounded="lg" class="pa-4">
                      <div class="d-flex align-center mb-4">
                        <v-icon icon="mdi-format-title" color="primary" class="mr-3" />
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">عنوان المقال</div>
                          <div class="text-caption text-medium-emphasis">
                            اكتب عنواناً جذاباً للمقال
                          </div>
                        </div>
                        <v-spacer />
                        <v-chip size="small" color="primary" variant="flat">
                          {{ titleLength }}/100
                        </v-chip>
                      </div>
                      
                      <v-text-field
                        v-model="post.title"
                        label="عنوان المقال"
                        :error-messages="titleError"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-text"
                        :counter="100"
                        maxlength="100"
                        required
                        @input="clearErrors"
                      />
                    </v-card>
                  </v-col>
                </v-row>

                <v-row class="mt-4">
                  <!-- محتوى المقال -->
                  <v-col cols="12">
                    <v-card elevation="1" rounded="lg" class="pa-4">
                      <div class="d-flex align-center mb-4">
                        <v-icon icon="mdi-text-box" color="primary" class="mr-3" />
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">محتوى المقال</div>
                          <div class="text-caption text-medium-emphasis">
                            اكتب محتوى المقال بالتفصيل
                          </div>
                        </div>
                        <v-spacer />
                        <v-chip size="small" color="primary" variant="flat">
                          {{ bodyLength }}/500
                        </v-chip>
                      </div>
                      
                      <v-textarea
                        v-model="post.body"
                        label="محتوى المقال"
                        :error-messages="bodyError"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-pencil"
                        rows="8"
                        auto-grow
                        :counter="500"
                        maxlength="500"
                        required
                        @input="clearErrors"
                      />
                    </v-card>
                  </v-col>
                </v-row>

                <!-- أزرار الإجراءات -->
                <v-row class="mt-6">
                  <v-col cols="12">
                    <div class="d-flex justify-end gap-4">
                      <v-btn
                        color="secondary"
                        variant="outlined"
                        prepend-icon="mdi-close"
                        @click="$router.back()"
                        :disabled="saving"
                      >
                        إلغاء
                      </v-btn>
                      
                      <v-btn
                        color="primary"
                        variant="flat"
                        prepend-icon="mdi-content-save"
                        type="submit"
                        :loading="saving"
                        :disabled="!isFormValid"
                      >
                        حفظ المقال
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- معاينة المقال -->
      <v-row v-if="post.title || post.body" class="mt-8">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="surface" density="compact">
              <v-toolbar-title class="text-h6">
                معاينة المقال
              </v-toolbar-title>
              <v-spacer />
              <v-chip color="info" variant="flat" size="small">
                معاينة
              </v-chip>
            </v-toolbar>
            
            <v-card-text class="pa-6">
              <div v-if="post.title" class="mb-6">
                <div class="text-caption text-medium-emphasis mb-2">العنوان:</div>
                <div class="text-h5 font-weight-bold">{{ post.title }}</div>
              </div>
              
              <div v-if="post.body">
                <div class="text-caption text-medium-emphasis mb-2">المحتوى:</div>
                <div class="text-body-1" style="white-space: pre-line;">{{ post.body }}</div>
              </div>
              
              <div v-if="!post.title && !post.body" class="text-center py-8">
                <v-icon icon="mdi-eye-off" size="64" class="mb-4 text-medium-emphasis" />
                <div class="text-h6 text-medium-emphasis">لا توجد معاينة متاحة</div>
                <div class="text-caption text-medium-emphasis">
                  ابدأ بكتابة عنوان أو محتوى المقال لعرض المعاينة
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDataStore, useUIStore } from "@/stores";

const router = useRouter();

// استخدام الـ Stores الجديدة
const dataStore = useDataStore();
const uiStore = useUIStore();

// Local state
const post = ref({
  userId: 0,
  id: 0,
  title: "",
  body: "",
});

const saving = ref(false);
const successMessage = ref("");
const errors = ref({
  userId: "",
  title: "",
  body: ""
});

// Computed properties
const loading = computed(() => 
  dataStore.isLoading && !dataStore.users.length
);

const usersOptions = computed(() => 
  dataStore.users.map(user => ({
    ...user,
    name: `${user.name} (${user.username})`
  }))
);

const selectedUser = computed(() => 
  dataStore.users.find(user => user.id === post.value.userId)
);

const userPostsCount = computed(() => 
  dataStore.posts.filter(p => p.userId === post.value.userId).length
);

const titleLength = computed(() => post.value.title.length);
const bodyLength = computed(() => post.value.body.length);

const isFormValid = computed(() => 
  post.value.userId > 0 && 
  post.value.title.trim().length >= 3 && 
  post.value.body.trim().length >= 10
);

// Error messages
const userIdError = computed(() => errors.value.userId);
const titleError = computed(() => errors.value.title);
const bodyError = computed(() => errors.value.body);

// Methods
const validateForm = () => {
  errors.value = { userId: "", title: "", body: "" };
  let isValid = true;

  if (!post.value.userId) {
    errors.value.userId = "يرجى اختيار مستخدم";
    isValid = false;
  }

  if (!post.value.title.trim()) {
    errors.value.title = "العنوان مطلوب";
    isValid = false;
  } else if (post.value.title.trim().length < 3) {
    errors.value.title = "العنوان يجب أن يكون 3 أحرف على الأقل";
    isValid = false;
  }

  if (!post.value.body.trim()) {
    errors.value.body = "المحتوى مطلوب";
    isValid = false;
  } else if (post.value.body.trim().length < 10) {
    errors.value.body = "المحتوى يجب أن يكون 10 أحرف على الأقل";
    isValid = false;
  }

  return isValid;
};

const clearErrors = () => {
  errors.value = { userId: "", title: "", body: "" };
  successMessage.value = "";
};

const savePost = async () => {
  if (!validateForm()) {
    uiStore.showNotification("يرجى تصحيح الأخطاء في النموذج", "error");
    return;
  }

  saving.value = true;
  successMessage.value = "";

  try {
    const newPostData = {
      userId: post.value.userId,
      title: post.value.title.trim(),
      body: post.value.body.trim()
    };

    const savedPost = await dataStore.createPost(newPostData);
    
    successMessage.value = "تم حفظ المقال بنجاح!";
    uiStore.showNotification("تم إنشاء المقال بنجاح", "success");
    
    // إعادة تعيين النموذج بعد 2 ثانية
    setTimeout(() => {
      post.value = { userId: 0, id: 0, title: "", body: "" };
      successMessage.value = "";
      
      // الانتقال لقائمة المقالات بعد 1 ثانية إضافية
      setTimeout(() => {
        router.push({ name: "posts" });
      }, 1000);
    }, 2000);
    
    return savedPost;
  } catch (error) {
    uiStore.showNotification("فشل في حفظ المقال", "error");
    throw error;
  } finally {
    saving.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  if (!dataStore.users.length) {
    await dataStore.fetchUsers();
  }
  if (!dataStore.posts.length) {
    await dataStore.fetchPosts();
  }
});
</script>

<style scoped>
.h-100 {
  height: 100%;
}

.opacity-50 {
  opacity: 0.5;
}

.v-card:hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:not(:hover) {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>