<!-- PhotosShow.vue -->
<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- حالة التحميل -->
    <div v-if="dataStore.isLoading && !dataStore.currentAlbumPhotos.length" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="5"
        class="mb-4"
      />
      <div class="text-h6 text-medium-emphasis">
        جارٍ تحميل الصور...
      </div>
    </div>

    <!-- المحتوى الرئيسي -->
    <div v-else>
      <!-- العنوان والإحصائيات -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg" class="pa-6">
            <div class="d-flex flex-column flex-md-row align-center justify-space-between gap-4">
              <div class="d-flex align-center">
                <div class="rounded-xl bg-primary pa-3 mr-4">
                  <v-icon icon="mdi-image-multiple" size="32" color="white" />
                </div>
                <div>
                  <h1 class="text-h4 text-primary font-weight-bold">
                    معرض الصور
                  </h1>
                  <div class="d-flex align-center mt-2">
                    <v-chip color="primary" variant="flat" size="small" class="mr-2">
                      الألبوم: {{ albumId }}
                    </v-chip>
                    <v-chip color="secondary" variant="flat" size="small">
                      {{ dataStore.currentAlbumPhotos.length }} صورة
                    </v-chip>
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-refresh"
                  @click="loadPhotos(albumId)"
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

      <!-- حالة عدم وجود صور -->
      <v-card
        v-else-if="!dataStore.currentAlbumPhotos.length && !dataStore.isLoading"
        elevation="2"
        rounded="lg"
        class="text-center py-12"
      >
        <v-icon icon="mdi-image-off" size="96" class="mb-6 text-medium-emphasis" />
        <div class="text-h5 text-medium-emphasis mb-2">
          لا توجد صور في هذا الألبوم
        </div>
        <div class="text-body-1 text-medium-emphasis mb-6">
          هذا الألبوم فارغ حالياً
        </div>
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          @click="$router.back()"
        >
          العودة للألبومات
        </v-btn>
      </v-card>

      <!-- معرض الصور -->
      <div v-else>
        <!-- خيارات العرض -->
        <v-card elevation="2" rounded="lg" class="mb-6 pa-4">
          <div class="d-flex flex-wrap align-center justify-space-between gap-4">
            <div class="d-flex align-center">
              <v-btn-toggle
                v-model="viewMode"
                mandatory
                color="primary"
                class="mr-4"
              >
                <v-btn value="grid" size="small">
                  <v-icon icon="mdi-view-grid" />
                  <span class="mr-2">شبكة</span>
                </v-btn>
                <v-btn value="list" size="small">
                  <v-icon icon="mdi-view-list" />
                  <span class="mr-2">قائمة</span>
                </v-btn>
              </v-btn-toggle>
              
              <v-text-field
                v-model="search"
                label="ابحث في الصور..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
                class="search-field"
                style="width: 300px"
              />
            </div>

            <div class="d-flex align-center">
              <span class="text-body-2 text-medium-emphasis mr-3">
                عرض:
              </span>
              <v-btn-toggle
                v-model="itemsPerRow"
                mandatory
                color="primary"
                density="compact"
              >
                <v-btn :value="3">
                  3
                </v-btn>
                <v-btn :value="4">
                  4
                </v-btn>
                <v-btn :value="6">
                  6
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </v-card>

        <!-- عرض الشبكة -->
        <v-row v-if="viewMode === 'grid'" dense>
          <v-col
            v-for="(photo, index) in filteredPhotos"
            :key="photo.id"
            :cols="12"
            :sm="12 / itemsPerRow"
            :md="12 / (itemsPerRow + 1)"
            :lg="12 / (itemsPerRow + 2)"
          >
            <v-card
              class="photo-card elevation-2"
              :class="{ 'photo-card-hover': hoveredIndex === index }"
              @mouseenter="hoveredIndex = index"
              @mouseleave="hoveredIndex = null"
              @click="openImage(photo)"
            >
              <!-- الصورة -->
              <div class="image-container">
                <v-img
                  :src="photo.thumbnailUrl || 'https://via.placeholder.com/300'"
                  :aspect-ratio="1"
                  cover
                  class="rounded-t-lg"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                      />
                    </div>
                  </template>
                </v-img>
                
                <!-- زر التكبير -->
                <v-btn
                  v-show="hoveredIndex === index"
                  icon="mdi-magnify-plus"
                  color="white"
                  variant="flat"
                  size="small"
                  class="zoom-btn"
                  @click.stop="openImage(photo)"
                />
              </div>

              <!-- تفاصيل الصورة -->
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <v-chip
                    color="primary"
                    variant="outlined"
                    size="small"
                    label
                  >
                    #{{ photo.id }}
                  </v-chip>
                  
                  <v-tooltip text="انقر لعرض الصورة بالحجم الكامل">
                    <template #activator="{ props }">
                      <v-icon
                        v-bind="props"
                        icon="mdi-information"
                        size="small"
                        color="primary"
                        class="cursor-pointer"
                      />
                    </template>
                  </v-tooltip>
                </div>
                
                <div class="text-body-2 photo-title" :title="photo.title">
                  {{ truncateText(photo.title, 50) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- عرض القائمة -->
        <v-card v-else elevation="2" rounded="lg">
          <v-list lines="two">
            <v-list-item
              v-for="(photo, index) in filteredPhotos"
              :key="photo.id"
              :class="{ 'bg-surface-variant': hoveredIndex === index }"
              @mouseenter="hoveredIndex = index"
              @mouseleave="hoveredIndex = null"
              @click="openImage(photo)"
              class="cursor-pointer"
            >
              <template #prepend>
                <v-avatar rounded="lg" size="80">
                  <v-img
                    :src="photo.thumbnailUrl || 'https://via.placeholder.com/80'"
                    cover
                  />
                </v-avatar>
              </template>

              <v-list-item-title class="text-h6 mb-1">
                {{ photo.title }}
              </v-list-item-title>
              
              <v-list-item-subtitle>
                <div class="d-flex align-center gap-2 mt-1">
                  <v-chip size="small" color="primary" variant="flat">
                    معرف: {{ photo.id }}
                  </v-chip>
                  <v-chip size="small" color="secondary" variant="outlined">
                    ألبوم: {{ albumId }}
                  </v-chip>
                </div>
              </v-list-item-subtitle>

              <template #append>
                <v-icon icon="mdi-chevron-left" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- لا توجد نتائج بحث -->
        <v-card
          v-if="search && !filteredPhotos.length"
          elevation="2"
          rounded="lg"
          class="text-center py-12 mt-6"
        >
          <v-icon icon="mdi-magnify-close" size="96" class="mb-6 text-medium-emphasis" />
          <div class="text-h5 text-medium-emphasis mb-2">
            لا توجد نتائج
          </div>
          <div class="text-body-1 text-medium-emphasis mb-6">
            لم يتم العثور على صور مطابقة لـ "{{ search }}"
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
      </div>
    </div>

    <!-- نافذة عرض الصورة -->
    <v-dialog v-model="imageDialog" max-width="800">
      <v-card v-if="selectedPhoto">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon icon="mdi-image" class="mr-2" />
            <span>مشاهدة الصورة</span>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="imageDialog = false"
          />
        </v-card-title>
        
        <v-divider />
        
        <v-card-text class="text-center pa-6">
          <v-img
            :src="selectedPhoto.url || selectedPhoto.thumbnailUrl"
            max-height="500"
            contain
            class="rounded-lg mb-4"
          />
          
          <div class="text-h6 mb-2">{{ selectedPhoto.title }}</div>
          <div class="text-body-2 text-medium-emphasis">
            <div>معرف الصورة: {{ selectedPhoto.id }}</div>
            <div>معرف الألبوم: {{ albumId }}</div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="primary"
            variant="flat"
            @click="imageDialog = false"
          >
            إغلاق
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useDataStore, useUIStore } from "@/stores";

const route = useRoute();

// استخدام الـ Stores الجديدة
const dataStore = useDataStore();
const uiStore = useUIStore();

// Local state
const hoveredIndex = ref<number | null>(null);
const viewMode = ref<'grid' | 'list'>('grid');
const itemsPerRow = ref(3);
const search = ref("");
const imageDialog = ref(false);
const selectedPhoto = ref<any>(null);

// الحصول على البيانات مباشرة من الـ store
const photos = computed(() => dataStore.currentAlbumPhotos);

// Computed
const albumId = computed<number>(() => {
  const id = Number(route.params.albumId);
  return Number.isFinite(id) ? id : 0;
});

const filteredPhotos = computed(() => {
  if (!search.value) return photos.value;
  
  const searchTerm = search.value.toLowerCase();
  return photos.value.filter(photo => 
    photo.title.toLowerCase().includes(searchTerm)
  );
});

// Methods
const loadPhotos = async (id: number) => {
  if (!id) return;
  try {
    await dataStore.fetchPhotosByAlbumId(id);
    uiStore.showNotification("تم تحديث الصور بنجاح", "success");
  } catch (error) {
    uiStore.showNotification("فشل في تحميل الصور", "error");
  }
};

const openImage = (photo: any) => {
  selectedPhoto.value = photo;
  imageDialog.value = true;
};

const clearSearch = () => {
  search.value = "";
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Lifecycle
onMounted(() => {
  loadPhotos(albumId.value);
});

// Watchers
watch(albumId, (newId, oldId) => {
  if (newId !== oldId) {
    loadPhotos(newId);
  }
});
</script>

<style scoped>
.photo-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
}

.photo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.photo-card-hover {
  z-index: 10;
}

.image-container {
  position: relative;
  overflow: hidden;
}

.image-container:hover img {
  transform: scale(1.05);
}

.image-container img {
  transition: transform 0.4s ease;
}

.zoom-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.photo-card:hover .zoom-btn {
  opacity: 1;
}

.photo-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  min-height: 2.8em;
}

.cursor-pointer {
  cursor: pointer;
}

.search-field {
  max-width: 300px;
}

::v-deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

::v-deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>