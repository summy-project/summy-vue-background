import { defineStore } from "pinia";

export interface UserState {
  userData: Record<string, any> | null;
}

export const useUserStore = defineStore("userStore", {
  state: (): UserState => ({
    userData: null
  }),
  actions: {
    setUserData(userData: Record<string, any> | null) {
      this.$patch({ userData });
    }
  },
  persist: true
});
