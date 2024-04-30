export const userRouter = {
  path: "user",
  name: "user",
  children: [
    {
      path: "manage",
      name: "user_manage",
      component: () => import("@/views/Dashboard/User/Manage/index.vue"),
      meta: {
        title: "用户管理"
      }
    },
    {
      path: "roles",
      name: "user_roles",
      component: () => import("@/views/Dashboard/User/Roles/index.vue"),
      meta: {
        title: "角色管理"
      }
    },
    {
      path: "inviteCode",
      name: "invite_code",
      component: () => import("@/views/Dashboard/User/InviteCode/index.vue"),
      meta: {
        title: "邀请码管理"
      }
    }
  ],
  meta: {
    title: "用户设置"
  }
};
