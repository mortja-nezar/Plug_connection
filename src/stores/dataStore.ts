// src/stores/dataStore.ts
import { defineStore } from "pinia";
import { api } from "./api";

// Types/Interfaces
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface Album {
  id: number;
  userId: number;
  title: string;
}

interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

// Data Store
export const useDataStore = defineStore("data", {
  state: () => ({
    // Users
    users: [] as User[],
    currentUser: null as User | null,

    // Posts
    posts: [] as Post[],

    // Comments - stored by postId for quick access
    commentsByPostId: {} as Record<number, Comment[]>,

    // Albums
    albums: [] as Album[],

    // Photos - stored by albumId for quick access
    photosByAlbumId: {} as Record<number, Photo[]>,

    // Todos
    todos: [] as Todo[],

    // Loading states
    isLoading: false,
    loadingUsers: false,
    loadingPosts: false,
    loadingAlbums: false,
    loadingTodos: false,

    // Error handling
    error: null as string | null,
  }),

  getters: {
    // Users Getters
    totalUsers: (state) => state.users.length,
    getUserById: (state) => (id: number) => state.users.find((user) => user.id === id),

    // Posts Getters
    totalPosts: (state) => state.posts.length,
    getPostById: (state) => (id: number) => state.posts.find((post) => post.id === id),
    getPostsByUserId: (state) => (userId: number) =>
      state.posts.filter((post) => post.userId === userId),

    // Comments Getters
    getCommentsByPostId: (state) => (postId: number) => state.commentsByPostId[postId] || [],
    getCommentsByPostIdMap: (state) => (postId: number) => state.commentsByPostId[postId] || [],

    // Albums Getters
    totalAlbums: (state) => state.albums.length,
    getAlbumById: (state) => (id: number) => state.albums.find((album) => album.id === id),
    getAlbumsByUserId: (state) => (userId: number) =>
      state.albums.filter((album) => album.userId === userId),

    // Photos Getters
    getPhotosByAlbumId: (state) => (albumId: number) => state.photosByAlbumId[albumId] || [],

    // Todos Getters
    totalTodos: (state) => state.todos.length,
    getTodosByUserId: (state) => (userId: number) =>
      state.todos.filter((todo) => todo.userId === userId),
    getCompletedTodosByUserId: (state) => (userId: number) =>
      state.todos.filter((todo) => todo.userId === userId && todo.completed),
    getPendingTodosByUserId: (state) => (userId: number) =>
      state.todos.filter((todo) => todo.userId === userId && !todo.completed),

    // Error state
    hasError: (state) => state.error !== null,
  },

  actions: {
    // ============ Users Actions ============
    async fetchUsers(force = false) {
      if (this.users.length > 0 && !force) return this.users;

      this.loadingUsers = true;
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get("/users");
        this.users = response.data;
        return this.users;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل المستخدمين";
        throw error;
      } finally {
        this.loadingUsers = false;
        this.isLoading = false;
      }
    },

    async fetchUserById(id: number) {
      try {
        const response = await api.get(`/users/${id}`);
        const user = response.data;

        // Update or add user to the list
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.users[index] = user;
        } else {
          this.users.push(user);
        }

        this.currentUser = user;
        return user;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل بيانات المستخدم";
        throw error;
      }
    },

    async deleteUser(id: number) {
      try {
        await api.delete(`/users/${id}`);
        this.users = this.users.filter((user) => user.id !== id);
        return true;
      } catch (error: any) {
        this.error = error.message || "فشل في حذف المستخدم";
        return false;
      }
    },

    // ============ Posts Actions ============
    async fetchPosts(force = false) {
      if (this.posts.length > 0 && !force) return this.posts;

      this.loadingPosts = true;
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get("/posts");
        this.posts = response.data;
        return this.posts;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل المقالات";
        throw error;
      } finally {
        this.loadingPosts = false;
        this.isLoading = false;
      }
    },

    async fetchPostById(id: number) {
      try {
        const response = await api.get(`/posts/${id}`);
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل المقال";
        throw error;
      }
    },

    async createPost(post: Omit<Post, "id">) {
      try {
        const response = await api.post("/posts", post);
        this.posts.unshift(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في إنشاء المقال";
        throw error;
      }
    },

    async updatePost(id: number, post: Partial<Post>) {
      try {
        const response = await api.put(`/posts/${id}`, post);
        const index = this.posts.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.posts[index] = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في تحديث المقال";
        throw error;
      }
    },

    async deletePost(id: number) {
      try {
        await api.delete(`/posts/${id}`);
        this.posts = this.posts.filter((post) => post.id !== id);
        return true;
      } catch (error: any) {
        this.error = error.message || "فشل في حذف المقال";
        return false;
      }
    },

    // ============ Comments Actions ============
    async fetchCommentsByPostId(postId: number, force = false) {
      if (this.commentsByPostId[postId] && !force) {
        return this.commentsByPostId[postId];
      }

      try {
        const response = await api.get(`/posts/${postId}/comments`);
        this.commentsByPostId[postId] = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل التعليقات";
        throw error;
      }
    },

    setComments(postId: number, comments: Comment[]) {
      this.commentsByPostId[postId] = comments;
    },

    async createComment(comment: Omit<Comment, "id">) {
      try {
        const response = await api.post("/comments", comment);
        const postId = comment.postId;

        if (!this.commentsByPostId[postId]) {
          this.commentsByPostId[postId] = [];
        }
        this.commentsByPostId[postId].push(response.data);

        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في إضافة التعليق";
        throw error;
      }
    },

    // ============ Albums Actions ============
    async fetchAlbums(force = false) {
      if (this.albums.length > 0 && !force) return this.albums;

      this.loadingAlbums = true;
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get("/albums");
        this.albums = response.data;
        return this.albums;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل الألبومات";
        throw error;
      } finally {
        this.loadingAlbums = false;
        this.isLoading = false;
      }
    },

    async fetchAlbumsByUserId(userId: number) {
      try {
        const response = await api.get(`/users/${userId}/albums`);
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل ألبومات المستخدم";
        throw error;
      }
    },

    // ============ Photos Actions ============
    async fetchPhotosByAlbumId(albumId: number, force = false) {
      if (this.photosByAlbumId[albumId] && !force) {
        return this.photosByAlbumId[albumId];
      }

      try {
        const response = await api.get(`/albums/${albumId}/photos`);
        this.photosByAlbumId[albumId] = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل الصور";
        throw error;
      }
    },

    async fetchAllPhotos() {
      try {
        const response = await api.get("/photos");
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل جميع الصور";
        throw error;
      }
    },

    // ============ Todos Actions ============
    async fetchTodos(force = false) {
      if (this.todos.length > 0 && !force) return this.todos;

      this.loadingTodos = true;
      this.isLoading = true;
      this.error = null;

      try {
        const response = await api.get("/todos");
        this.todos = response.data;
        return this.todos;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل المهام";
        throw error;
      } finally {
        this.loadingTodos = false;
        this.isLoading = false;
      }
    },

    async fetchTodosByUserId(userId: number) {
      try {
        const response = await api.get(`/users/${userId}/todos`);
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في تحميل مهام المستخدم";
        throw error;
      }
    },

    async toggleTodo(id: number) {
      const todo = this.todos.find((t) => t.id === id);
      if (!todo) return;

      try {
        const response = await api.patch(`/todos/${id}`, {
          completed: !todo.completed,
        });

        const index = this.todos.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.todos[index] = response.data;
        }

        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في تحديث المهمة";
        throw error;
      }
    },

    async createTodo(todo: Omit<Todo, "id">) {
      try {
        const response = await api.post("/todos", todo);
        this.todos.unshift(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.message || "فشل في إضافة المهمة";
        throw error;
      }
    },

    async deleteTodo(id: number) {
      try {
        await api.delete(`/todos/${id}`);
        this.todos = this.todos.filter((todo) => todo.id !== id);
        return true;
      } catch (error: any) {
        this.error = error.message || "فشل في حذف المهمة";
        return false;
      }
    },

    // ============ Utility Actions ============
    clearError() {
      this.error = null;
    },

    resetStore() {
      this.$reset();
    },
  },
});
