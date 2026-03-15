<template>
  <v-expansion-panels>
    <v-expansion-panel elevation="2" rounded="lg">
      <v-expansion-panel-title expand-icon="mdi-chevron-down" collapse-icon="mdi-chevron-up">
        <div class="d-flex align-center w-100">
          <v-icon icon="mdi-format-list-checkbox" color="primary" class="mr-3" />
          <div class="flex-grow-1">
            <div class="text-h6 font-weight-bold">المهام</div>
            <div class="text-caption text-medium-emphasis">
              {{ userTodos.length }} مهمة • {{ completedCount }} مكتملة • {{ pendingCount }} قيد الانتظار
            </div>
          </div>
          <v-chip :color="loadingTodos ? 'warning' : 'primary'" variant="flat" size="small">
            {{ loadingTodos ? 'جار التحميل...' : `${completedCount}/${userTodos.length}` }}
          </v-chip>
        </div>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <!-- حالة التحميل -->
        <div v-if="loadingTodos" class="text-center py-6">
          <v-progress-circular indeterminate color="primary" size="32" width="3" class="mb-3"/>
          <div class="text-caption text-medium-emphasis">جارٍ تحميل المهام...</div>
        </div>

        <!-- رسالة الخطأ -->
        <v-alert v-else-if="dataStore.hasError" type="error" variant="tonal" density="compact" border="start" class="mb-4">
          <template #prepend>
            <v-icon icon="mdi-alert-circle" size="small"/>
          </template>
          <div class="text-caption">{{ dataStore.error }}</div>
        </v-alert>

        <!-- حالة عدم وجود مهام -->
        <div v-else-if="!userTodos.length" class="text-center py-6">
          <v-icon icon="mdi-check-circle-outline" size="48" class="mb-3 text-medium-emphasis"/>
          <div class="text-h6 text-medium-emphasis mb-2">لا توجد مهام</div>
          <div class="text-caption text-medium-emphasis">لم يتم إضافة أي مهام لهذا المستخدم</div>
        </div>

        <!-- قائمة المهام -->
        <div v-else class="todo-list">
          <v-list lines="two" density="compact">
            <v-list-item
              v-for="todo in sortedTodos"
              :key="todo.id"
              :class="todo.completed ? 'todo-completed' : 'todo-pending'"
              class="mb-2 rounded-lg"
            >
              <template #prepend>
                <v-checkbox
                  :model-value="todo.completed"
                  color="primary"
                  hide-details
                  density="compact"
                  disabled
                />
              </template>

              <template #title>
                <div class="d-flex align-center">
                  <span :class="{ 'text-decoration-line-through': todo.completed }">{{ todo.title }}</span>
                  <v-chip
                    size="x-small"
                    :color="todo.completed ? 'success-lighten4' : 'error-lighten4'"
                    text-color="black"
                    variant="flat"
                    class="ml-2"
                  >
                    {{ todo.completed ? 'مكتملة' : 'قيد الانتظار' }}
                  </v-chip>
                </div>
              </template>

              <template #subtitle>
                <div class="d-flex align-center mt-1">
                  <v-icon
                    :icon="todo.completed ? 'mdi-check-circle' : 'mdi-clock-outline'"
                    :color="todo.completed ? 'success' : 'error'"
                    size="small"
                    class="mr-1"
                  />
                  <span class="text-caption">{{ todo.completed ? 'تم الإنجاز' : 'في انتظار الإنجاز' }}</span>
                  <v-spacer/>
                  <span class="text-caption text-medium-emphasis">#{{ todo.id }}</span>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <!-- إحصائيات المهام -->
          <v-card elevation="1" rounded="lg" class="mt-4 pa-3">
            <div class="d-flex justify-space-between align-center">
              <div class="text-center">
                <div class="text-caption text-medium-emphasis">الإجمالي</div>
                <div class="text-h5 font-weight-bold">{{ userTodos.length }}</div>
              </div>

              <v-divider vertical />

              <div class="text-center">
                <div class="text-caption text-medium-emphasis">المكتملة</div>
                <div class="text-h5 font-weight-bold text-success">{{ completedCount }}</div>
              </div>

              <v-divider vertical />

              <div class="text-center">
                <div class="text-caption text-medium-emphasis">القيد الانتظار</div>
                <div class="text-h5 font-weight-bold text-error">{{ pendingCount }}</div>
              </div>

              <v-divider vertical />

              <div class="text-center">
                <div class="text-caption text-medium-emphasis">النسبة</div>
                <div class="text-h5 font-weight-bold">{{ completionPercentage }}%</div>
              </div>
            </div>

            <v-progress-linear
              :model-value="completionPercentage"
              color="success"
              height="8"
              rounded
              class="mt-3"
            />
          </v-card>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDataStore } from '@/stores';

const props = defineProps<{ userId: number }>();
const dataStore = useDataStore();

const loadingTodos = ref(false);

// ربط المهام مباشرة بالـ store
const userTodos = computed(() => dataStore.getTodosByUserId(props.userId));

// إحصائيات
const completedCount = computed(() => userTodos.value.filter(t => t.completed).length);
const pendingCount = computed(() => userTodos.value.filter(t => !t.completed).length);
const completionPercentage = computed(() => userTodos.value.length ? Math.round((completedCount.value / userTodos.value.length) * 100) : 0);

// ترتيب المهام
const sortedTodos = computed(() => [...userTodos.value].sort((a, b) => a.completed ? 1 : -1));

// تحميل المهام
const loadTodos = async (userId: number) => {
  if (!userId) return;
  loadingTodos.value = true;
  try {
    await dataStore.fetchTodosByUserId(userId);
  } catch (err) {
    console.error(err);
  } finally {
    loadingTodos.value = false;
  }
};

// Watch على تغير userId
watch(() => props.userId, id => { if (id) loadTodos(id); }, { immediate: true });
</script>

<style scoped>
.todo-list {
  max-height: 400px;
  overflow-y: auto;
}

/* الخلفية حسب الثيم مع الشريط الأيسر */
.todo-completed {
  background-color: rgb(var(--v-theme-surface));
  border-left: 4px solid rgb(var(--v-theme-success));
}

.todo-pending {
  background-color: rgb(var(--v-theme-surface));
  border-left: 4px solid rgb(var(--v-theme-error));
}

/* تأثير hover خفيف */
.todo-completed:hover,
.todo-pending:hover {
  background-color: rgb(var(--v-theme-surface-variant));
}

.text-decoration-line-through {
  text-decoration: line-through;
  opacity: 0.7;
}

.w-100 { width: 100%; }
</style>
