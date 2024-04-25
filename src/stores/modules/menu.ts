import { defineStore } from "pinia";

export interface MenuState {
  activeMenu: string | number | null;
  menuData: Record<string, any> | null;
}

export const useMenuStore = defineStore("menuStore", {
  state: (): MenuState => ({
    activeMenu: null,
    menuData: null
  }),
  actions: {
    setMenuData(menuData: Record<string, any> | null) {
      this.$patch({ menuData });
    },
    setActiveMenu(activeMenu: string | number | null) {
      this.$patch({ activeMenu });
    }
  },
  persist: true
});
