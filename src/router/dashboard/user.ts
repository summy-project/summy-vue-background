export const userRouter = {
  path: "user",
  name: "user",
  children: [
    {
      path: "manage",
      name: "user_manage",
      component: () => import("@/views/Dashboard/User/Manage/index.vue")
    },
    {
      path: "roles",
      name: "user_roles",
      component: () => import("@/views/Dashboard/User/Roles/index.vue")
    },
    {
      path: "inviteCode",
      name: "invite_code",
      component: () => import("@/views/Dashboard/User/InviteCode/index.vue")
    }
  ]
};
