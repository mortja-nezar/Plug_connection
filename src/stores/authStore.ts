// stores/authStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = ref(false);

  const login = async (credentials: { email: string; password: string }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password.length >= 6) {
          const mockUser = {
            id: 1,
            name: "مستخدم تجريبي",
            email: credentials.email,
            username: "demo_user",
            token: "mock-jwt-token-123456"
          };
          
          user.value = mockUser;
          token.value = mockUser.token;
          isAuthenticated.value = true;
          
          localStorage.setItem('auth_token', mockUser.token);
          localStorage.setItem('user_data', JSON.stringify(mockUser));
          
          resolve(mockUser);
        } else {
          reject(new Error('بيانات الدخول غير صحيحة'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const checkAuth = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (storedToken && storedUser) {
      user.value = JSON.parse(storedUser);
      token.value = storedToken;
      isAuthenticated.value = true;
      return true;
    }
    
    return false;
  };

  const init = () => {
    checkAuth();
  };

  init();

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
});