export const systemRouter = {
  path: "system",
  name: "system",
  children: [
    {
      path: "dict",
      name: "dict_manage",
      component: () => import("@/views/Dashboard/System/Dict/index.vue")
    },
    {
      path: "menu",
      name: "menu_manage",
      component: () => import("@/views/Dashboard/System/Menu/index.vue")
    }
  ]
};
