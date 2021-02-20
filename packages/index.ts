import { App } from "vue";
import { ClickOutsidePlugin, ClipboardPlugin } from "vue3-normal-directive";
import PopuColorPicker from "./PopuColorPicker.vue";
import Vue3Storage from "vue3-storage";
import FkColorPicker from "./fk/index.vue";
import ChromeColorPicker from "./chrome/index.vue";
import EleColorPicker from "./ele/index.vue";

const components = [
  FkColorPicker,
  PopuColorPicker,
  ChromeColorPicker,
  EleColorPicker
];

const install = (app: App) => {
  app.use(ClickOutsidePlugin);
  app.use(ClipboardPlugin);
  app.use(Vue3Storage);

  components.forEach(comp => {
    app.component(comp.name, comp);
  });
};

export { PopuColorPicker, FkColorPicker, ChromeColorPicker, EleColorPicker };

export default { install };
