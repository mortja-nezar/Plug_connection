// stores/uiStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUIStore = defineStore('ui', () => {
  // === Theme ===
  const theme = ref<'light' | 'dark'>('light');
  const THEME_KEY = 'app_theme';

  // === Navigation ===
  const drawer = ref(false);
  const currentPage = ref(''); // الصفحة الحالية

  // === Loading & Notifications ===
  const isLoading = ref(false);
  const notifications = ref<any[]>([]);

  // === Getters ===
  const isDark = computed(() => theme.value === 'dark');

  // === Theme Actions ===
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, theme.value);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
    localStorage.setItem(THEME_KEY, newTheme);
  };

  const loadThemeFromStorage = () => {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark';
    if (savedTheme) theme.value = savedTheme;
  };

  // === Drawer Actions ===
  const toggleDrawer = () => {
    drawer.value = !drawer.value;
  };

  // === Page Actions ===
  const setCurrentPage = (page: string) => {
    currentPage.value = page;
  };

  // === Notifications Actions ===
  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 3000
  ) => {
    const id = Date.now();
    notifications.value.push({ id, message, type });

    setTimeout(() => removeNotification(id), duration);
  };

  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  };

  // === Init ===
  loadThemeFromStorage();

  return {
    theme,
    isDark,
    drawer,
    currentPage,
    isLoading,
    notifications,

    toggleTheme,
    setTheme,
    toggleDrawer,
    setCurrentPage, // ← أضفتها هنا
    showNotification,
    removeNotification,
  };
});
