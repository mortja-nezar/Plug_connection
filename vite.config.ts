import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import vuetify from "vite-plugin-vuetify";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      enabled: process.env.NODE_ENV === "development",
    }),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/settings.scss" as *;`,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue", "vue-router", "pinia"],
          vuetify: ["vuetify"],
          axios: ["axios"],
          vendor: ["mitt"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  }, // <--- هذا القوس كان غالباً مفقوداً أو زائداً
  server: {
    port: 5173,
    host: true,
    fs: {
      strict: false,
    },
  },
});
