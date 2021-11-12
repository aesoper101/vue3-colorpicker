import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   port: 6001,
  //   https: false,
  //   host: true,
  //   hmr: {
  //     port: 443,
  //     protocol: "ws",
  //   },
  // },
  server: {
    port: 3000,
    https: true,
    hmr: {
      host: "localhost",
      port: 3001,
      protocol: "wss",
    },
  },
  plugins: [vue(), vueJsx()],
});
