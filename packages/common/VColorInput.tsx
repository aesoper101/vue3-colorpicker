import { defineComponent, PropType, ref, toRaw, watch } from "vue";
import { Color, ColorAttrs, ColorInput } from "../color";
import { ArrayUtils } from "@aesoper/normal-utils";

const formatList = ["hex", "hsl", "rgb", "hsv"];

export default defineComponent({
  name: "VColorInput",
  props: {
    color: {
      type: [String, Object] as PropType<ColorInput>,
      default: "#000000",
    },
  },
  emits: ["update:color", "change"],
  setup(props, { emit }) {
    const colorClass = new Color();

    const currentFormat = ref(formatList[1]);
    const currentColor = ref<ColorAttrs>(colorClass.parseColor(props.color));

    const onChangeFormat = () => {
      const index = ArrayUtils.findIndex(formatList, (val: string) => val == currentFormat.value);

      currentFormat.value = formatList[(index + 1) % formatList.length];
    };

    watch(
      () => props.color,
      (newVal: ColorInput) => {
        currentColor.value = colorClass.parseColor(toRaw(newVal));
      }
    );

    const doOnChange = (data: any, oldHue?: number): void => {
      currentColor.value = colorClass.parseColor(data, oldHue);
      emit("update:color", currentColor.value);
      emit("change", currentColor.value);
    };

    const onInputChange = (source: string) => {
      switch (source) {
        case "hex":
          doOnChange({ hex: currentColor.value.hex, source: "hex" });
          break;
        case "hsl":
          doOnChange({ hsl: currentColor.value.hsl, source: "hsl" });
          break;
        case "rgb":
          doOnChange({ rgb: currentColor.value.rgb, source: "rgb" });
          break;
        case "hsv":
          doOnChange({ hsv: currentColor.value.hsv, source: "hsv" });
      }
    };

    return () => {
      return (
        <div class="inputs-controls">
          <button class="formatBtn" onClick={onChangeFormat}>
            {currentFormat.value}
          </button>
          {currentFormat.value === "hsv" && (
            <div class="format-group">
              <input
                v-model={currentColor.value.hsv.h}
                type="number"
                min="0"
                max="360"
                placeholder="h"
                onBlur={() => onInputChange("hsv")}
              />
              <input
                v-model={currentColor.value.hsv.s}
                type="number"
                min="0"
                max="1"
                placeholder="s"
                onBlur={() => onInputChange("hsv")}
              />
              <input
                v-model={currentColor.value.hsv.v}
                type="number"
                min="0"
                max="1"
                placeholder="v"
                onBlur={() => onInputChange("hsv")}
              />
            </div>
          )}
          {currentFormat.value === "hsl" && (
            <div class="format-group">
              <input
                v-model={currentColor.value.hsl.h}
                type="number"
                min="0"
                max="360"
                placeholder="h"
                onBlur={() => onInputChange("hsl")}
              />
              <input
                v-model={currentColor.value.hsl.s}
                type="number"
                min="0"
                max="1"
                placeholder="s"
                onBlur={() => onInputChange("hsl")}
              />
              <input
                v-model={currentColor.value.hsl.l}
                type="number"
                min="0"
                max="1"
                placeholder="l"
                onBlur={() => onInputChange("hsl")}
              />
            </div>
          )}
          {currentFormat.value === "rgb" && (
            <div class="format-group">
              <input
                v-model={currentColor.value.rgb.r}
                type="number"
                min="0"
                max="255"
                placeholder="r"
                onBlur={() => onInputChange("rgb")}
              />
              <input
                v-model={currentColor.value.rgb.g}
                type="number"
                min="0"
                max="255"
                placeholder="g"
                onBlur={() => onInputChange("rgb")}
              />
              <input
                v-model={currentColor.value.rgb.b}
                type="number"
                min="0"
                max="255"
                onBlur={() => onInputChange("rgb")}
                placeholder="b"
              />
            </div>
          )}
          {currentFormat.value === "hex" && (
            <div class="format-group">
              <input
                v-model={currentColor.value.hex}
                type="text"
                maxlength="7"
                placeholder="hex"
                onBlur={() => onInputChange("hex")}
              />
            </div>
          )}
        </div>
      );
    };
  },
});
