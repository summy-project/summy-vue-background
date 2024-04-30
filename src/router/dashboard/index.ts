import DashboardLayout from "@/layouts/dashboard.vue";
import { userRouter } from "./user";
import { systemRouter } from "./system";

export const dashboardRouter = {
  path: "/dashboard",
  name: "dashboard",
  component: DashboardLayout,
  redirect: "/dashboard/home",
  meta: {
    title: "仪表盘"
  },
  children: [
    {
      path: "home",
      name: "dashboard_home",
      component: () => import("@/views/Dashboard/index.vue"),
      meta: {
        title: "仪表盘主页"
      }
    },
    userRouter,
    systemRouter
  ]
};
