import { App } from "vue";
import { ClickOutsidePlugin, ClipboardPlugin } from "vue3-normal-directive";
// import FK from "./fk/index.vue";
// import Chrome from "./chrome/index.vue";
// import ColorPicker from "./ColorPicker.vue";
import Vue3Storage from "vue3-storage";
import TestPicker from "./fk/index.vue";

const components = [TestPicker];

const install = (app: App) => {
  app.use(ClickOutsidePlugin);
  app.use(ClipboardPlugin);
  app.use(Vue3Storage);

  components.forEach(comp => {
    app.component(comp.name, comp);
  });
};

export default { install };
