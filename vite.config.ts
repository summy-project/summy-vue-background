import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueDevTools from "vite-plugin-vue-devtools";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { TDesignResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          console.log(id);
          // 将主要的第三方库内容独立打包。
          if (id.includes("node_modules/echarts")) return "echarts";
          if (id.includes("node_modules/tdesign-vue-next")) return "tdesign";
          if (id.includes("node_modules/tdesign-icons-vue-next")) return "tdesign-icons";
          if (id.includes("node_modules/uuid")) return "uuid";
          if (id.includes("node_modules/radash")) return "radash";
        }
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: "vue-next"
        })
      ]
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: "vue-next"
        })
      ]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 5200,
    proxy: {
      "/api": {
        target: "http://localhost:5202",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
