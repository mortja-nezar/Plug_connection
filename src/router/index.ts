// router/index.ts
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { 
    path: "/", 
    name: "home", 
    component: () => import("@/views/home/HomePage.vue"),
    meta: {
      title: "لوحة التحكم",
      icon: "mdi-home",
      breadcrumb: ["الرئيسية"]
    }
  },
  { 
    path: "/users", 
    name: "user", 
    component: () => import("@/views/user/users.vue"),
    meta: {
      title: "إدارة المستخدمين",
      icon: "mdi-account-group",
      breadcrumb: ["الرئيسية", "المستخدمين"]
    }
  },
  {
    path: "/posts",
    name: "posts",
    component: () => import("@/views/posts/showpost/PostsView.vue"),
    meta: {
      title: "المقالات",
      icon: "mdi-post",
      breadcrumb: ["الرئيسية", "المقالات"]
    }
  },
  {
    path: "/user/:id",
    name: "userDetails",
    component: () => import("@/views/UserInfo/UserInformation.vue"),
    props: true,
    meta: {
      title: "معلومات المستخدم",
      icon: "mdi-account",
      breadcrumb: ["الرئيسية", "المستخدمين", "تفاصيل المستخدم"]
    }
  },
  {
    path: "/user/:id/albums/:albumId",
    name: "albumPhotos",
    component: () => import("@/views/UserInfo/AlbumsImage.vue"),
    props: true,
    meta: {
      title: "صور الألبوم",
      icon: "mdi-image-album",
      breadcrumb: ["الرئيسية", "المستخدمين", "الألبومات", "الصور"]
    }
  },
  { 
    path: "/albums", 
    name: "allalbums", 
    component: () => import("@/views/albums/AllAlbumjs.vue"),
    meta: {
      title: "الألبومات",
      icon: "mdi-album",
      breadcrumb: ["الرئيسية", "الألبومات"]
    }
  },
  {
    path: "/albums/:albumId/photos",
    name: "allphotos",
    component: () => import("@/views/albums/PhotosShow.vue"),
    props: true,
    meta: {
      title: "معرض الصور",
      icon: "mdi-image-multiple",
      breadcrumb: ["الرئيسية", "الألبومات", "الصور"]
    }
  },
  {
    path: "/posts/:postId/comments",
    name: "PostComments",
    component: () => import("@/views/posts/comment/PostComments.vue"),
    props: true,
    meta: {
      title: "تعليقات المقال",
      icon: "mdi-comment-multiple",
      breadcrumb: ["الرئيسية", "المقالات", "التعليقات"]
    }
  },
  {
    path: "/newpost",
    name: "newpost",
    component: () => import("@/views/posts/newpost/NewPost.vue"),
    meta: {
      title: "مقال جديد",
      icon: "mdi-pencil-plus",
      breadcrumb: ["الرئيسية", "المقالات", "جديد"]
    }
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfilePage.vue"),
    meta: {
      title: "الملف الشخصي",
      icon: "mdi-account",
      breadcrumb: ["الرئيسية", "الملف الشخصي"]
    }
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/SettingsPage.vue"),
    meta: {
      title: "الإعدادات",
      icon: "mdi-cog",
      breadcrumb: ["الرئيسية", "الإعدادات"]
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/errors/NotFound.vue"),
    meta: {
      title: "الصفحة غير موجودة",
      hideFromNav: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: "smooth" };
  }
});

/*
  تم إلغاء Route Guard بالكامل
  لا تسجيل دخول
  لا توكن
  جميع الصفحات متاحة مباشرة
*/
router.beforeEach((to, from, next) => {
  next();
});

export default router;