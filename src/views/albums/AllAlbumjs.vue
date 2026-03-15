<!-- src/views/albums/AllAlbums.vue -->
<template>
  <v-container fluid>
    <!-- شريط البحث والإجراءات -->
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="بحث في الألبومات..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          density="comfortable"
        />
      </v-col>

      <v-col cols="12" md="6" class="d-flex justify-end align-center gap-2">
        <v-chip
          v-if="isLoading"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-loading mdi-spin"
        >
          جاري التحميل...
        </v-chip>

        <v-chip
          v-if="error"
          color="error"
          variant="outlined"
          prepend-icon="mdi-alert"
          @click="clearError"
        >
          {{ error }}
        </v-chip>

        <v-btn color="primary" prepend-icon="mdi-refresh" @click="refreshData" :loading="isLoading">
          تحديث
        </v-btn>

        <v-btn color="success" prepend-icon="mdi-plus" @click="createNewAlbum">
          ألبوم جديد
        </v-btn>
      </v-col>
    </v-row>

    <!-- حالة عدم وجود بيانات -->
    <v-row v-if="!isLoading && (!filteredAlbums || filteredAlbums.length === 0)">
      <v-col cols="12">
        <v-alert type="info" variant="tonal" icon="mdi-information" title="لا توجد ألبومات">
          {{ search ? 'لم يتم العثور على ألبومات تطابق بحثك' : 'لا توجد ألبومات لعرضها' }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- شبكة الألبومات -->
    <v-row v-else>
      <v-col
        v-for="album in filteredAlbums"
        :key="album.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="album-card h-100" elevation="2" hover>
          <v-card-title>
            <v-avatar color="primary" size="48" class="text-white">
              <v-icon icon="mdi-album" size="24" />
            </v-avatar>
            <span class="ml-3">{{ album.title }}</span>
          </v-card-title>

          <v-card-subtitle>
            <v-icon icon="mdi-account" size="16" class="mr-1" />
            {{ getUserName(album.userId) }}
          </v-card-subtitle>

          <v-card-actions class="px-4 pb-4">
            <v-btn color="primary" variant="text" size="small" @click="viewAlbum(album)">
              <v-icon icon="mdi-image-multiple" size="16" class="mr-1" />
              الصور
            </v-btn>

            <v-spacer />

            <v-btn color="error" variant="text" size="small" @click.stop="confirmDeleteAlbum(album)">
              <v-icon icon="mdi-delete" size="16" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog حذف الألبوم -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon icon="mdi-alert" color="warning" class="mr-2" />
          تأكيد الحذف
        </v-card-title>

        <v-card-text>
          هل أنت متأكد من حذف الألبوم "{{ selectedAlbum?.title }}"؟
          <div class="text-caption text-medium-emphasis mt-2">
            هذه العملية لا يمكن التراجع عنها.
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" variant="text" @click="deleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" variant="flat" :loading="isLoading" @click="confirmDelete">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- زر العودة للأعلى -->
    <v-btn
      fab
      fixed
      bottom
      end
      color="primary"
      @click="scrollToTop"
    >
      <v-icon icon="mdi-chevron-up" />
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDataStore } from "@/stores/dataStore";
import { useUIStore } from "@/stores/uiStore";
import { id } from "vuetify/locale";

const router = useRouter();
const dataStore = useDataStore();
const uiStore = useUIStore();

const search = ref("");
const deleteDialog = ref(false);
const selectedAlbum = ref<any>(null);

// ✅ استخدام الخصائص من store بشكل صحيح
const albums = computed(() => dataStore.albums);
const isLoading = computed(() => dataStore.loading);
const error = computed(() => dataStore.error);
const users = computed(() => dataStore.users);

// ✅ الحصول على اسم المستخدم
const getUserName = (userId: number) => {
  const user = users.value.find(u => u.id === userId);
  return user?.name || 'مستخدم غير معروف';
};

// ✅ البحث في الألبومات مع تحسينات الأمان
const filteredAlbums = computed(() => {
  const albumList = albums.value || [];
  
  if (!search.value.trim()) return albumList;

  const term = search.value.toLowerCase().trim();
  return albumList.filter((album: any) => {
    if (!album) return false;
    
    const titleMatch = album.title?.toLowerCase().includes(term) || false;
    const userName = getUserName(album.userId).toLowerCase();
    const userMatch = userName.includes(term);
    
    return titleMatch || userMatch;
  });
});

// ✅ عند تحميل الصفحة
onMounted(async () => {
  try {
    // تحميل البيانات إذا لم تكن محملة
    if (dataStore.users.length === 0) {
      await dataStore.fetchUsers();
    }
    if (dataStore.albums.length === 0) {
      await dataStore.fetchAlbums();
    }
  } catch (err) {
    console.error('فشل تحميل البيانات:', err);
  }
});

// ✅ دالة clearError المعدلة
const clearError = () => {
  dataStore.clearError(); // استخدم الدالة المخصصة من الـ store
};

// ✅ دالة حذف الألبوم المعدلة
const deleteAlbum = async (albumId: number) => {
  try {
    const success = await dataStore.deleteAlbum(albumId);
    if (success) {
      // عرض إشعار النجاح
      console.log("تم حذف الألبوم بنجاح");
    } else {
      console.error("فشل في حذف الألبوم");
    }
  } catch (err) {
    console.error('خطأ في حذف الألبوم:', err);
  }
};

// ✅ بقية الدوال المعدلة
const refreshData = async () => {
  try {
    await dataStore.fetchAlbums();
    console.log("تم تحديث قائمة الألبومات");
  } catch {
    console.error("فشل في تحديث البيانات");
  }
};

const viewAlbum = (album: any) => {
  if (album?.id) {
    router.push({ name: "albumPhotos", params: {  id: album.userId, albumId: album.id } });
  }
};

const confirmDeleteAlbum = (album: any) => {
  if (album) {
    selectedAlbum.value = album;
    deleteDialog.value = true;
  }
};

const confirmDelete = async () => {
  if (selectedAlbum.value?.id) {
    await deleteAlbum(selectedAlbum.value.id);
    deleteDialog.value = false;
    selectedAlbum.value = null;
  }
};

const createNewAlbum = () => {
  console.log("ميزة إنشاء ألبوم جديد قيد التطوير");
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped>
.album-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.album-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.h-100 {
  height: 100%;
}
</style>