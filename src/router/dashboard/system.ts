export const systemRouter = {
  path: "system",
  name: "system",
  children: [
    {
      path: "dict",
      name: "dict_manage",
      component: () => import("@/views/Dashboard/System/Dict/index.vue"),
      meta: {
        title: "字典管理"
      }
    },
    {
      path: "menu",
      name: "menu_manage",
      component: () => import("@/views/Dashboard/System/Menu/index.vue"),
      meta: {
        title: "菜单管理"
      }
    }
  ],
  meta: {
    title: "系统设置"
  }
};
