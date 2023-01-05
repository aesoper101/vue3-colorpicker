import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    https: false,
    hmr: {
      host: "localhost",
      port: 3001,
      protocol: "ws",
    },
  },
  plugins: [vue(), vueJsx()],
});
