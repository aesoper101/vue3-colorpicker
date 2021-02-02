import { App } from "vue";
import { ClickOutside, Clipboard } from "vue3-normal-directive";
import FK from "./fk/index.vue";
import Chrome from "./chrome/index.vue";
import ColorPicker from "./ColorPicker.vue";
import Vue3Storage from "vue3-storage";

const components = [FK, Chrome, ColorPicker];

const install = (app: App) => {
  app.use(ClickOutside);
  app.use(Clipboard);
  app.use(Vue3Storage);
  components.forEach(comp => {
    app.component(comp.name, comp);
  });
};

export default { install };
