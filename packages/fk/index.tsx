import { defineComponent, PropType, ref, watch, toRaw, onMounted } from "vue";
import Hue from "../common/Hue";
import Compact from "../common/Compact";
import Saturation from "../common/Saturation";
import Alpha from "../common/Alpha";
import Light from "../common/Light";
import History from "../common/History";
import {
  ColorAttrs,
  ColorInput,
  Color,
  ColorFormat,
  debounceFn,
  STORAGE_COLOR_KEY,
} from "../color";
import { useStorage } from "vue3-storage";
import { useClipboard } from "@vueuse/core";

const MAX_STORAGE_LENGTH = 8;

export default defineComponent({
  name: "FkColorPicker",
  props: {
    color: {
      type: [String, Object] as PropType<ColorInput>,
      default: "#000000",
    },
    format: {
      type: String as PropType<ColorFormat>,
    },
    disableAlpha: Boolean,
    disableLight: Boolean,
    disableHue: Boolean,
    disableHistory: Boolean,
    disableClipboard: Boolean,
    displayCurrentColor: {
      type: Boolean,
      default: true,
    },
    historyRound: Boolean,
    copyBtnText: {
      type: String,
      default: "复制",
    },
    backBtnText: {
      type: String,
      default: "返回",
    },
  },
  emits: ["update:color", "change"],
  setup(props, { emit }) {
    const colorClass = new Color();

    const currentColor = ref<ColorAttrs>(colorClass.parseColor(props.color));
    const _oldHue = ref(currentColor.value.oldHue);
    const advancePanelShow = ref(false);

    const storage = useStorage();
    const storageColorList = ref<string[]>([]);

    const onBack = () => {
      advancePanelShow.value = false;
    };

    const onStorageColor = () => {
      storageColorList.value = storageColorList.value.filter((value) => {
        return value !== currentColor.value.hex8;
      });
      if (storageColorList.value.length >= MAX_STORAGE_LENGTH) {
        storageColorList.value.shift();
      }
      storageColorList.value.push(currentColor.value.hex8);
      storage.setStorage({
        key: STORAGE_COLOR_KEY,
        data: storageColorList.value,
      });
    };

    const onInitColorList = () => {
      storageColorList.value = storage.getStorageSync<string[]>(STORAGE_COLOR_KEY) || [];
    };

    const doOnChange = (data: any, oldHue?: number): void => {
      currentColor.value = colorClass.parseColor(data, oldHue);
      debounceFn(onStorageColor);
    };

    const doUpdate = () => {
      if (props.format) {
        emit("update:color", colorClass.format(props.format));
        emit("change", colorClass.format(props.format));
      } else {
        emit("update:color", currentColor.value);
        emit("change", currentColor.value);
      }
    };

    const onCompactChange = (color: string) => {
      if (color === "advance") {
        advancePanelShow.value = true;
      } else {
        _oldHue.value = currentColor.value.hsl.h;
        doOnChange(color);
        doUpdate();
      }
    };

    const onLightChange = (light: number) => {
      doOnChange(
        {
          h: currentColor.value.hsl.h,
          s: currentColor.value.hsl.s,
          l: light / 100,
          a: currentColor.value.hsl.a,
          source: "light",
        },
        currentColor.value.hsl.h
      );
      doUpdate();
    };

    const onAlphaChange = (alpha: number) => {
      doOnChange(
        {
          h: currentColor.value.hsl.h,
          s: currentColor.value.hsl.s,
          l: currentColor.value.hsl.l,
          a: alpha,
          source: "alpha",
        },
        currentColor.value.hsl.h
      );
      doUpdate();
    };

    const onSaturationChange = (saturation: number, bright: number) => {
      doOnChange(
        {
          h: currentColor.value.hsv.h,
          s: saturation,
          v: bright,
          a: currentColor.value.hsv.a,
          source: "saturation",
        },
        currentColor.value.hsv.h
      );
      doUpdate();
    };

    const onHueChange = (hue: number) => {
      const { s: saturation, v: bright, a: alpha } = currentColor.value.hsv;
      doOnChange(
        {
          h: hue,
          s: saturation,
          v: bright,
          a: alpha,
          source: "hue",
        },
        hue
      );

      doUpdate();
    };

    const onInputChange = (event: FocusEvent) => {
      const target = event.target as HTMLInputElement;
      const hex = target.value;
      doOnChange({ hex: hex });
      doUpdate();
    };

    watch(
      () => props.color,
      (newVal: ColorInput) => {
        doOnChange(toRaw(newVal));
        onInitColorList();
      }
    );

    onMounted(() => {
      onInitColorList();
    });

    const onCopy = () => {
      const { copy } = useClipboard({ source: currentColor.value.hex });
      copy().then();
    };

    return () => {
      return (
        <div class="bee-fk-colorPicker">
          <div class="bee-fk-colorPicker__inner">
            {advancePanelShow.value && (
              <div class="bee-fk-colorPicker__header">
                <span style="cursor: pointer" onClick={onBack}>
                  <div class="back" />
                  <span>{props.backBtnText}</span>
                </span>
              </div>
            )}
            {!advancePanelShow.value && <Compact onChange={onCompactChange} />}
            {advancePanelShow.value && (
              <Saturation
                saturation={currentColor.value.hsv.s}
                hue={currentColor.value.hsv.h}
                value={currentColor.value.hsv.v}
                onChange={onSaturationChange}
              />
            )}
            {advancePanelShow.value && !props.disableHue && (
              <Hue hue={currentColor.value.hsv.h} onChange={onHueChange} />
            )}
            {!advancePanelShow.value && !props.disableLight && (
              <Light
                hue={currentColor.value.hsl.h}
                light={currentColor.value.hsl.l * 100}
                saturation={currentColor.value.hsl.s * 100}
                onChange={onLightChange}
              />
            )}
            {!props.disableAlpha && (
              <Alpha
                color={currentColor.value.hex8}
                onChange={onAlphaChange}
                alpha={currentColor.value.alpha}
              />
            )}
            {props.displayCurrentColor && (
              <div class="bee-fk-colorPicker__display">
                <div class="current-color transparent">
                  <div class="color-cube" style={{ background: currentColor.value.hex8 }} />
                </div>
                <span class="hexColor-prefix">#</span>
                <input
                  class="hexColor-input"
                  value={currentColor.value.hex.replace("#", "")}
                  onBlur={onInputChange}
                />
                {!props.disableClipboard && (
                  <div class="action">
                    <div class="copy-btn" onClick={() => onCopy()}>
                      {props.copyBtnText}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!props.disableHistory && storageColorList.value.length > 0 && (
              <History
                color-list={storageColorList.value}
                round={props.historyRound}
                onChange={onCompactChange}
              />
            )}
          </div>
        </div>
      );
    };
  },
});
