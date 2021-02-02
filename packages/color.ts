import { ref, reactive, toRaw, watch, onMounted, SetupContext } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import tinycolor from "tinycolor2";
import { useStorage } from "vue3-storage";

interface Color {
  color: string;
  hue: number;
  light: number;
  saturation: number;
  hslSaturation: number;
  value: number;
  alpha: number;
}

export interface ColorPickerProps {
  color: string;
  disableAlpha: boolean;
  disableLight: boolean;
  disableHue: boolean;
  disableHistory: boolean;
}

export const useColorSetup = (props: ColorPickerProps, ctx: SetupContext) => {
  const storage = useStorage();
  const storageColorList = ref<string[]>([]);
  const { emit } = ctx;
  const advancePanelShow = ref(false);
  const currentColor = reactive<Color>({
    color: props.color,
    hue: 0,
    light: 0,
    saturation: 0,
    hslSaturation: 0,
    value: 0,
    alpha: 1
  });
  const currentColorInput = ref(props.color.replace("#", ""));

  const onCompactChange = (color: string) => {
    if (color === "advance") {
      advancePanelShow.value = true;
    } else {
      const colorInstance = tinycolor(color);
      const hsv = colorInstance.toHsv();

      currentColor.color = color;
      currentColor.hue = colorInstance.toHsv().h;
      currentColor.saturation = hsv.s;
      currentColor.value = hsv.v;
      currentColor.light = colorInstance.toHsl().l * 100;
      currentColor.alpha = hsv.a;
      currentColor.hslSaturation = colorInstance.toHsl().s * 100;
      emit("update:color", currentColor.color);
      emit("change", currentColor.color, toRaw(currentColor));
    }
  };

  const onHueChange = (hue: number) => {
    currentColor.hue = hue;
    const colorInstance = tinycolor({
      h: hue,
      s: currentColor.saturation,
      v: currentColor.value,
      a: currentColor.alpha
    });

    currentColor.color = colorInstance.toHex8String();
    emit("update:color", currentColor.color);
    emit("change", currentColor.color, toRaw(currentColor));
  };

  const onAlphaChange = (alpha: number) => {
    currentColor.alpha = alpha;
    const colorInstance = tinycolor({
      h: currentColor.hue,
      s: currentColor.saturation,
      v: currentColor.value,
      a: currentColor.alpha
    });
    currentColor.color = colorInstance.toHex8String();
    emit("update:color", currentColor.color);
    emit("change", currentColor.color, toRaw(currentColor));
  };

  const onLightChange = (light: number) => {
    const colorInstance = tinycolor({
      h: currentColor.hue,
      s: currentColor.saturation,
      v: currentColor.value,
      a: currentColor.alpha
    });
    const hsl = colorInstance.toHsl();

    hsl.l = light / 100;

    currentColor.light = light;
    currentColor.color = tinycolor(hsl).toHex8String();

    emit("update:color", currentColor.color);
    emit("change", currentColor.color, toRaw(currentColor));
  };

  const onSaturationChange = (saturation: number, bright: number) => {
    currentColor.saturation = saturation;
    currentColor.value = bright;
    const colorInstance = tinycolor({
      h: currentColor.hue,
      s: currentColor.saturation,
      v: currentColor.value,
      a: currentColor.alpha
    });

    const hsl = colorInstance.toHsl();

    currentColor.light = hsl.l * 100;
    currentColor.color = colorInstance.toHex8String();

    emit("update:color", currentColor.color);
    emit("change", currentColor.color, toRaw(currentColor));
  };

  const onBack = () => {
    advancePanelShow.value = false;
  };

  const onInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.replace("#", "");
    const color = "#" + value;

    if (tinycolor(value).isValid()) {
      const format = tinycolor(value).getFormat();
      if (format === "hex" || format === "hex8") {
        currentColor.color = color;
      } else {
        target.value = currentColorInput.value;
      }
    } else {
      target.value = currentColorInput.value;
    }
  };

  const onInitalize = () => {
    if (tinycolor(currentColor.color).isValid()) {
      const colorInstance = tinycolor(currentColor.color);
      const hsv = colorInstance.toHsv();

      currentColor.hue = hsv.h;
      currentColor.saturation = hsv.s;
      currentColor.value = hsv.v;
      currentColor.light = colorInstance.toHsl().l * 100;
      currentColor.alpha = hsv.a;
      currentColor.hslSaturation = colorInstance.toHsl().s * 100;
    }
  };

  const onStorageColor = () => {
    storageColorList.value = storageColorList.value.filter(value => {
      return value !== currentColor.color;
    });
    if (storageColorList.value.length >= 6) {
      storageColorList.value.shift();
    }
    storageColorList.value.push(currentColor.color);
    storage?.setStorage({
      key: "colorList",
      data: storageColorList.value
    });
  };

  const onInitColorList = () => {
    storageColorList.value =
      storage?.getStorageSync<string[]>("colorList") || [];
  };

  watch(
    () => props.color,
    (color: string) => {
      if (color && color !== currentColor.color) {
        currentColor.color = color;
        onInitalize();
      }
    }
  );

  watch(
    () => currentColor.color,
    () => {
      currentColorInput.value = currentColor.color.replace("#", "");
      onStorageColor();
    }
  );

  onMounted(() => {
    onInitalize();
    onInitColorList();
  });

  return {
    currentColor,
    advancePanelShow,
    currentColorInput,
    onCompactChange,
    onBack,
    onHueChange,
    onLightChange,
    onSaturationChange,
    onAlphaChange,
    onInputChange,
    storageColorList
  };
};
