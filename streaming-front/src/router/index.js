import { createRouter, createWebHistory } from "vue-router";

/**
 * Инициализация роутера приложения
 * @param {Object} AS - Объект состояния приложения
 * @returns {router} Настроенный экземпляр роутера
 */
function initRouter() {
  //определение маршрутов
  const routes = [
    {
      name: "home",
      path: "/",
      component: () => import("@/views/home-view.vue"),
      meta: {
        name: "Рекомендации",
        public: true,
        layout: 'main'
      },
    },
    {
      name: "login",
      path: "/login",
      component: () => import("@/views/login-view.vue"),
      meta: {
        public: true,
        layout: 'main'
      },
    },
    {
      name: "shorts",
      path: "/shorts",
      component: () => import("@/views/shorts-view.vue"),
      meta: {
        name: "Шортсы",
        public: true,
        layout: 'main'
      },
    },
    {
      name: "collection",
      path: "/collection",
      component: () => import("@/views/collection-view.vue"),
      meta: {
        name: "Подписки",
        public: true,
        layout: 'main'
      },
    },
    {
      name: "video",
      path: "/video",
      component: () => import("@/views/video-view.vue"),
      meta: {
        name: "Видео",
        public: true,
        layout: 'main'
      },
    },
    {
      name: "channel",
      path: "/channel/:identifier",
      component: () => import("@/views/channel-view.vue"),
      meta: {
        name: "Канал",
        public: true,
        layout: 'main'
      },
    },
    {
      name: "you",
      path: "/you",
      component: () => import("@/views/account-view.vue"),
      meta: {
        name: "Аккаунт",
        public: true,
        layout: 'main'
      },
    },
    {
      name: "profile",
      path: "/profile/:identifier",
      component: () => import("@/views/profile-view.vue"),
      meta: {
        name: "Канал",
        layout: 'main'
      },
    },
    {
      name: "createStream",
      path: "/studio/livestreaming",
      component: () => import("@/gaze-studio/create-stream/create-steram.vue"),
      meta: {
        name: "Прямая трансляция",
        layout: 'studio'
      },
    },
    {
      name: "createPost",
      path: "/studio/livestreaming",
      component: () => import("@/gaze-studio/create-post/create-post.vue"),
      meta: {
        name: "Новый пост",
        layout: 'studio'
      },
    },
    {
      name: "uploadVOD",
      path: "/studio/livestreaming",
      component: () => import("@/gaze-studio/upload-vod/upload-vod.vue"),
      meta: {
        name: "Загрузить VOD",
        layout: 'studio'
      },
    },
    {
      name: "studioChannel",
      path: "/studio/channel",
      component: () => import("@/gaze-studio/studio-channel/studio-channel.vue"),
      meta: {
        name: "Панель канала",
        layout: 'studio'
      },
    },
    {
      name: "notFound",
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/not-found-view.vue"),
      meta: {
        name: "Не найдено",
        public: true,
      },
    },
  ];

  //создание экземпляра роутера
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  });

  return router;
}

export default initRouter;
