import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import colorPicker from "vue3-colorpicker";
import "vue3-colorpicker/bundle.css";

createApp(App)
  .use(router)
  .use(colorPicker)
  .mount("#app");
