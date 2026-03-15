<!-- users.vue -->
<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- العنوان الرئيسي -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center">
            <v-icon 
              icon="mdi-account-group" 
              size="x-large" 
              color="primary" 
              class="mr-3"
            />
            <div>
              <h1 class="text-h4 text-primary font-weight-bold">
                إدارة المستخدمين
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis mt-1">
                عرض وتعديل وإدارة جميع المستخدمين
              </p>
            </div>
          </div>
          
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-refresh"
            @click="refreshUsers"
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
              label="ابحث في المستخدمين..."
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
              @click="addUser"
            >
              مستخدم جديد
            </v-btn>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg" class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">إجمالي المستخدمين</div>
              <div class="text-h4 font-weight-bold text-primary">
                {{ dataStore.totalUsers }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ filteredUsers.length }} نتيجة للبحث
              </div>
            </div>
            <v-icon icon="mdi-account-group" size="48" color="primary" class="opacity-50" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- حالة التحميل -->
    <v-skeleton-loader
      v-if="dataStore.isLoading && !dataStore.users.length"
      type="table"
      class="rounded-lg mb-4"
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

    <!-- حالة عدم وجود مستخدمين -->
    <v-card
      v-else-if="!dataStore.users.length && !dataStore.isLoading"
      elevation="2"
      rounded="lg"
      class="text-center py-12"
    >
      <v-icon icon="mdi-account-off" size="96" class="mb-6 text-medium-emphasis" />
      <div class="text-h5 text-medium-emphasis mb-2">
        لا يوجد مستخدمين
      </div>
      <div class="text-body-1 text-medium-emphasis mb-6">
        لم يتم إضافة أي مستخدمين حتى الآن
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="addUser"
      >
        إضافة أول مستخدم
      </v-btn>
    </v-card>

    <!-- جدول المستخدمين -->
    <v-card v-else elevation="2" rounded="lg" class="overflow-hidden">
      <v-data-table
        :headers="enhancedHeaders"
        :items="filteredUsers"
        :search="search"
        :loading="dataStore.isLoading"
        density="comfortable"
        item-value="id"
        class="rounded-lg"
      >
        <!-- رأس الجدول -->
        <template #top>
          <v-toolbar color="surface" density="compact" class="px-4">
            <v-toolbar-title class="text-h6">
              قائمة المستخدمين
            </v-toolbar-title>
            <v-spacer />
            <v-chip color="primary" variant="flat" size="small">
              {{ filteredUsers.length }} / {{ dataStore.totalUsers }}
            </v-chip>
          </v-toolbar>
        </template>

        <!-- عمود الاسم -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="40" color="primary" class="mr-3">
              <span class="text-white font-weight-bold">{{ getInitials(item.name) }}</span>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-body-1">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">@{{ item.username }}</div>
            </div>
          </div>
        </template>

        <!-- عمود البريد -->
        <template #item.email="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-email" size="small" color="primary" class="mr-2" />
            <a :href="`mailto:${item.email}`" class="text-decoration-none">
              {{ item.email }}
            </a>
          </div>
        </template>

        <!-- عمود الهاتف -->
        <template #item.phone="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-phone" size="small" color="secondary" class="mr-2" />
            <a :href="`tel:${item.phone}`" class="text-decoration-none">
              {{ item.phone }}
            </a>
          </div>
        </template>

        <!-- عمود الموقع -->
        <template #item.website="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-web" size="small" color="info" class="mr-2" />
            <a 
              :href="item.website.startsWith('http') ? item.website : `https://${item.website}`" 
              target="_blank"
              class="text-decoration-none"
            >
              {{ item.website }}
            </a>
          </div>
        </template>

        <!-- عمود العنوان -->
        <template #item.address="{ item }">
          <div class="text-caption">
            <div>{{ item.address.street }}, {{ item.address.suite }}</div>
            <div>{{ item.address.city }}, {{ item.address.zipcode }}</div>
          </div>
        </template>

        <!-- عمود الإجراءات -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <v-tooltip text="عرض التفاصيل">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  color="info"
                  variant="text"
                  size="small"
                  @click="router.push({ name: 'userDetails', params: { id: item.id } })"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="تعديل المستخدم">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil"
                  color="primary"
                  variant="text"
                  size="small"
                  @click="editUser(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="حذف المستخدم">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  size="small"
                  @click="confirmDelete(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- حالة عدم وجود بيانات -->
        <template #no-data>
          <div class="py-8 text-center">
            <v-icon icon="mdi-account-off" size="64" class="mb-4 text-medium-emphasis" />
            <div class="text-h6 text-medium-emphasis mb-2">لا توجد مستخدمين</div>
            <div class="text-body-2 text-medium-emphasis mb-4">
              لم يتم العثور على مستخدمين مطابقة للبحث
            </div>
            <v-btn
              color="primary"
              variant="outlined"
              @click="refreshUsers"
              prepend-icon="mdi-refresh"
            >
              تحميل البيانات
            </v-btn>
          </div>
        </template>

        <!-- حالة البحث -->
        <template #no-results>
          <div class="py-8 text-center">
            <v-icon icon="mdi-magnify-close" size="64" class="mb-4 text-medium-emphasis" />
            <div class="text-h6 text-medium-emphasis mb-2">لا توجد نتائج</div>
            <div class="text-body-2 text-medium-emphasis mb-4">
              لم يتم العثور على مستخدمين مطابقة لـ "{{ search }}"
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
        </template>
      </v-data-table>
    </v-card>

    <!-- حذف تأكيد -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-alert" color="error" class="mr-2" />
          <span class="text-h6">تأكيد الحذف</span>
        </v-card-title>
        
        <v-card-text class="pt-4">
          هل أنت متأكد من أنك تريد حذف المستخدم:
          <strong class="text-primary">"{{ selectedUser?.name }}"</strong>؟
          <div class="text-caption text-medium-emphasis mt-2">
            هذا الإجراء لا يمكن التراجع عنه.
          </div>
        </v-card-text>
        
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            إلغاء
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="deleteUser(selectedUser!.id)"
            :loading="deleting"
            prepend-icon="mdi-delete"
          >
            حذف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- تعديل/إضافة مستخدم -->
    <v-dialog v-model="editDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon :icon="isAddMode ? 'mdi-plus' : 'mdi-pencil'" :color="isAddMode ? 'success' : 'primary'" class="mr-2" />
          <span class="text-h6">{{ isAddMode ? 'إضافة مستخدم جديد' : 'تعديل المستخدم' }}</span>
        </v-card-title>
        
        <v-divider />
        
        <v-card-text class="pt-6">
          <v-form @submit.prevent="saveUser">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.name"
                  label="الاسم الكامل"
                  variant="outlined"
                  density="comfortable"
                  required
                  class="mb-4"
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.username"
                  label="اسم المستخدم"
                  variant="outlined"
                  density="comfortable"
                  required
                  class="mb-4"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.email"
                  label="البريد الإلكتروني"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  required
                  class="mb-4"
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.phone"
                  label="رقم الهاتف"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editingUser.website"
                  label="الموقع الإلكتروني"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                />
              </v-col>
            </v-row>
            
            <v-expansion-panels class="mb-4">
              <v-expansion-panel title="العنوان">
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editingUser.address.street"
                        label="الشارع"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editingUser.address.suite"
                        label="المنطقة"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editingUser.address.city"
                        label="المدينة"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editingUser.address.zipcode"
                        label="الرمز البريدي"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
              
              <v-expansion-panel title="الشركة">
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editingUser.company.name"
                        label="اسم الشركة"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editingUser.company.catchPhrase"
                        label="شعار الشركة"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editingUser.company.bs"
                        label="مجال العمل"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            variant="text"
            @click="editDialog = false"
            :disabled="saving"
          >
            إلغاء
          </v-btn>
          <v-btn
            :color="isAddMode ? 'success' : 'primary'"
            variant="flat"
            @click="saveUser"
            :loading="saving"
            :prepend-icon="isAddMode ? 'mdi-plus' : 'mdi-content-save'"
          >
            {{ isAddMode ? 'إضافة' : 'حفظ التعديلات' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useDataStore, useUIStore } from "@/stores";

const router = useRouter();

// استخدام الـ Stores الجديدة
const dataStore = useDataStore();
const uiStore = useUIStore();

// Local state
const search = ref("");
const deleteDialog = ref(false);
const editDialog = ref(false);
const selectedUser = ref<any>(null);
const isAddMode = ref(false);
const deleting = ref(false);
const saving = ref(false);

const editingUser = ref({
  id: 0,
  name: "",
  username: "",
  email: "",
  phone: "",
  website: "",
  address: {
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: { lat: "", lng: "" },
  },
  company: { name: "", catchPhrase: "", bs: "" },
});

// الحصول على البيانات مباشرة من الـ store
const users = computed(() => dataStore.users);

// البحث المصفى
const filteredUsers = computed(() => {
  if (!search.value) return users.value;
  
  const searchTerm = search.value.toLowerCase();
  return users.value.filter(user => 
    user.name.toLowerCase().includes(searchTerm) ||
    user.username.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user.phone.toLowerCase().includes(searchTerm) ||
    user.website.toLowerCase().includes(searchTerm)
  );
});

const enhancedHeaders = [
  {
    title: "المستخدم",
    key: "name",
    sortable: true,
    width: "250px"
  },
  {
    title: "البريد الإلكتروني",
    key: "email",
    sortable: true
  },
  {
    title: "الهاتف",
    key: "phone",
    sortable: true
  },
  {
    title: "الموقع",
    key: "website",
    sortable: true
  },
  {
    title: "العنوان",
    key: "address",
    sortable: false
  },
  {
    title: "الإجراءات",
    key: "actions",
    sortable: false,
    align: "center",
    width: "150px"
  }
];

// Methods
const refreshUsers = async () => {
  try {
    await dataStore.fetchUsers(true); // force refresh
    uiStore.showNotification("تم تحديث المستخدمين بنجاح", "success");
  } catch (error) {
    uiStore.showNotification("فشل في تحديث المستخدمين", "error");
  }
};

const viewUserDetails = (userId: number) => {
  router.push({name: "userDetails", params: { userId }});
};

const addUser = () => {
  editingUser.value = {
    id: 0,
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: { lat: "", lng: "" },
    },
    company: { name: "", catchPhrase: "", bs: "" },
  };
  isAddMode.value = true;
  editDialog.value = true;
};

const editUser = (user: any) => {
  editingUser.value = JSON.parse(JSON.stringify(user));
  isAddMode.value = false;
  editDialog.value = true;
};

const confirmDelete = (user: any) => {
  selectedUser.value = user;
  deleteDialog.value = true;
};

const saveUser = async () => {
  saving.value = true;
  
  try {
    if (isAddMode.value) {
      // محاكاة إضافة مستخدم جديد (لأن API وهمي)
      const newUser = {
        ...editingUser.value,
        id: Date.now()
      };
      
      // إضافة للقائمة (محاكاة)
      dataStore.users.unshift(newUser);
      uiStore.showNotification("تم إضافة المستخدم بنجاح", "success");
    } else {
      // محاكاة تحديث مستخدم (لأن API وهمي)
      const index = dataStore.users.findIndex(u => u.id === editingUser.value.id);
      if (index !== -1) {
        dataStore.users[index] = { ...dataStore.users[index], ...editingUser.value };
      }
      uiStore.showNotification("تم تحديث المستخدم بنجاح", "success");
    }
    
    editDialog.value = false;
  } catch (error) {
    uiStore.showNotification("فشل في حفظ المستخدم", "error");
  } finally {
    saving.value = false;
  }
};

const deleteUser = async (id: number) => {
  deleting.value = true;
  try {
    const success = await dataStore.deleteUser(id);
    if (success) {
      deleteDialog.value = false;
      uiStore.showNotification("تم حذف المستخدم بنجاح", "success");
    } else {
      uiStore.showNotification("فشل في حذف المستخدم", "error");
    }
  } finally {
    deleting.value = false;
  }
};

const clearSearch = () => {
  search.value = "";
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Lifecycle
onMounted(async () => {
  if (!dataStore.users.length) {
    await dataStore.fetchUsers();
  }
});
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}

.v-data-table {
  border-radius: 12px;
}

::v-deep(.v-data-table-header) {
  background-color: rgb(var(--v-theme-surface));
}

::v-deep(.v-data-table-row:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.text-decoration-none {
  text-decoration: none;
}
</style>