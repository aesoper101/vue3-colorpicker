import { App, Plugin } from "vue";

import "./styles/index.scss";
import ColorPicker from "./ColorPicker.vue";

const components = [ColorPicker];

const Vue3ColorPicker: Plugin = {
  install: (app: App) => {
    components.forEach((comp) => {
      app.component(comp.name, comp);
    });
  },
};

export { ColorPicker };

export default Vue3ColorPicker;
