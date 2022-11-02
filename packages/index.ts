import { App, Plugin } from "vue";

import "./styles/index.scss";
import ColorPicker from "./ColorPicker.vue";
import type ColorPickerProps from "./ColorPicker.vue";

const Vue3ColorPicker: Plugin = {
  install: (app: App) => {
    app.component(ColorPicker.name, ColorPicker);
    app.component("Vue3" + ColorPicker.name, ColorPicker);
  },
};

export { ColorPicker, ColorPickerProps };

export default Vue3ColorPicker;
