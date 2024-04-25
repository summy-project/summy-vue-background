import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/index.vue";

import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: "项目主页"
      }
    },
    authRouter,
    dashboardRouter
  ]
});

export default router;
