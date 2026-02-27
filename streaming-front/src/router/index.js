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
      name: "login",
      path: "/login",
      component: () => import("@/views/login-view.vue"),
      meta: {
        public: true,
      },
    },
    {
      name: "shorts",
      path: "/shorts",
      component: () => import("@/views/shorts-view.vue"),
      meta: {
        name: "Шортсы",
        public: true,
      },
    },
    {
      name: "collection",
      path: "/collection",
      component: () => import("@/views/collection-view.vue"),
      meta: {
        name: "Подписки",
        public: true,
      },
    },
    {
      name: "video",
      path: "/video",
      component: () => import("@/views/video-view.vue"),
      meta: {
        name: "Видео",
        public: true,
      },
    },
    {
      name: "home",
      path: "/",
      component: () => import("@/views/home-view.vue"),
      meta: {
        name: "Рекомендации",
        public: true,
      },
    },
    {
      name: "channel",
      path: "/channel/:identifier",
      component: () => import("@/views/channel-view.vue"),
      meta: {
        name: "Канал",
        public: true,
      },
    },
    {
      name: "you",
      path: "/you",
      component: () => import("@/views/account-view.vue"),
      meta: {
        name: "Аккаунт",
        public: true,
      },
    },
    {
      name: "profile",
      path: "/profile/:identifier",
      component: () => import("@/views/profile-view.vue"),
      meta: {
        name: "Канал",
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
