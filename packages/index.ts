import { App, Plugin } from "vue";

import "./styles/index.scss";
import ColorPicker from "./ColorPicker.vue";

const Vue3ColorPicker: Plugin = {
  install: (app: App) => {
    app.component(ColorPicker.name, ColorPicker);
  },
};

export { ColorPicker };

export default Vue3ColorPicker;
