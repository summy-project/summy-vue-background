<template>
  <t-layout style="height: 100vh">
    <t-aside>
      <t-menu :value="activeMenuValue" theme="dark" @change="handleChange">
        <t-submenu
          v-for="item in pageData.menuData"
          :value="item.code"
          :key="item.id"
          :title="item.name"
        >
          <t-menu-item
            v-for="_item in item.children"
            :key="_item.id"
            :value="_item.code"
            >{{ _item.name }}</t-menu-item
          >
          <template #icon>
            <t-icon :name="item.pcIcon" />
          </template>
        </t-submenu>
      </t-menu>
    </t-aside>
    <t-layout>
      <t-header>
        <t-head-menu theme="light">
          <t-breadcrumb :max-item-width="'150'">
            <t-breadcrumb-item
              :to="item.path"
              v-for="item in routeMenu"
              :key="item.name"
            >
              {{ item.meta.title }}
            </t-breadcrumb-item>
          </t-breadcrumb>
          <template #operations>
            <t-dropdown
              :options="pageData.userOptions"
              @click="clickUserHandler"
            >
              <t-button variant="text" shape="square">
                <template #icon><t-icon name="user" /></template>
              </t-button>
            </t-dropdown>
          </template>
        </t-head-menu>
      </t-header>
      <t-content style="height: 100vh; padding: 1.2rem; overflow: auto">
        <RouterView />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NotifyPlugin } from "tdesign-vue-next";

import { useMenuStore } from "@/stores/modules/menu";
import { useUserStore } from "@/stores/modules/user";

const route = useRoute();
const router = useRouter();

const menuStore = useMenuStore();
const userStore = useUserStore();

const routeMenu = route.matched;

const pageData = reactive<Record<string, any>>({
  userOptions: [
    {
      content: "退出登录",
      value: "logout"
    }
  ],
  menuData: []
});

// 菜单变化时候的点击
const handleChange = (e: string) => {
  menuStore.activeMenu = e;
  router.push({ name: e });
};

const activeMenuValue = computed(() => {
  return menuStore.activeMenu;
});

const clickUserHandler = (e: Record<string, any>) => {
  if (e.value === "logout") {
    window.sessionStorage.removeItem("userAuthToken");
    window.localStorage.removeItem("userAuthToken");
    userStore.setUserData(null);
    menuStore.setActiveMenu(null);
    menuStore.setMenuData(null);
    NotifyPlugin.warning({ title: "提示", content: "已经退出登录。" });
    router.push("/auth/login");
  }
};

pageData.menuData = menuStore.menuData;
</script>
