import AuthLayout from "@/layouts/auth.vue";

export const authRouter = {
  path: "/auth",
  name: "auth",
  component: AuthLayout,
  meta: {
    title: "认证"
  },
  children: [
    {
      path: "signup",
      name: "signup",
      component: import("@/views/Auth/Signup/index.vue"),
      meta: {
        title: "注册"
      }
    },
    {
      path: "login",
      name: "login",
      component: import("@/views/Auth/Login/index.vue"),
      meta: {
        title: "登录"
      }
    },
    {
      path: "setup",
      name: "setup",
      component: import("@/views/Auth/Setup/index.vue"),
      meta: {
        title: "初始化"
      }
    }
  ]
};
