import { App, Plugin } from "vue";
import { ClickOutside } from "vue3-normal-directive";
import PopuColorPicker from "./popup";
import Vue3Storage from "vue3-storage";
import FkColorPicker from "./fk";
import ChromeColorPicker from "./chrome";
import EleColorPicker from "./ele";

import "./styles/index.scss";

const components = [FkColorPicker, PopuColorPicker, ChromeColorPicker, EleColorPicker];

const Vue3ColorPicker: Plugin = {
  install: (app: App) => {
    app.use(ClickOutside);
    app.use(Vue3Storage);

    components.forEach((comp) => {
      app.component(comp.name, comp);
    });
  },
};

export { PopuColorPicker, FkColorPicker, ChromeColorPicker, EleColorPicker };

export default Vue3ColorPicker;
