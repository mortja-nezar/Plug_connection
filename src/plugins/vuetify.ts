import { createVuetify, type ThemeDefinition } from "vuetify";
import "vuetify/styles";
export const THEME_KEY = "app-theme";

/* الثيم الفاتح */
const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#000101",
    secondary: "#16476A",
    background: "#ffffff",
    surface: "#ffffff",
    card: "#c0bbbb",
    text: "#000000",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

/* الثيم المظلم */
const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#87BAC3",
    secondary: "#16476A",
    background: "#000000",
    surface: "#121212",
    card: "#383737",
    text: "#ffffff",
    error: "#CF6679",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

/* قراءة الثيم المحفوظ */
const savedTheme = (localStorage.getItem(THEME_KEY) as "lightTheme" | "darkTheme") || "lightTheme";

export default createVuetify({
  /* إعداد الأيقونات (mdi font) */
  icons: {
    defaultSet: "mdi",
  },

  /* إعداد الثيم */
  theme: {
    defaultTheme: savedTheme,
    themes: {
      lightTheme,
      darkTheme,
    },
  },

  /* إعدادات افتراضية للمكونات */
  defaults: {
    VBtn: {
      color: "primary",
      variant: "flat",
      rounded: "lg",
    },
    VTextField: {
      color: "primary",
      variant: "outlined",
      density: "comfortable",
    },
    VCard: {
      elevation: 2,
      rounded: "lg",
    },
  },
});
