import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import colorPicker from "../packages";

createApp(App)
  .use(router)
  .use(colorPicker)
  .mount("#app");
