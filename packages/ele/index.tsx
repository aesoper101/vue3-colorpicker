import { defineComponent, onMounted, PropType, ref, toRaw, watch } from "vue";
import {
  Color,
  ColorAttrs,
  ColorFormat,
  ColorInput,
  debounceFn,
  MAX_STORAGE_LENGTH,
  STORAGE_COLOR_KEY,
} from "../color";
import { useStorage } from "vue3-storage";
import Saturation from "../common/Saturation";
import Hue from "../common/Hue";
import Alpha from "../common/Alpha";
import VColorInput from "../common/VColorInput";
import History from "../common/History";

export default defineComponent({
  name: "EleColorPicker",
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
    historyRound: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:color", "change"],
  setup(props, { emit }) {
    const colorClass = new Color();

    const currentColor = ref<ColorAttrs>(colorClass.parseColor(props.color));

    const storage = useStorage();
    const storageColorList = ref<string[]>([]);

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
      doOnChange(color);
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

    const onInputChange = (val: ColorAttrs) => {
      currentColor.value = val;
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

    return () => {
      return (
        <div class="bee-ele-colorPicker">
          <div class="bee-ele-row">
            <Saturation
              class="bee-ele-saturation"
              hidden={true}
              saturation={currentColor.value.hsv.s}
              hue={currentColor.value.hsv.h}
              value={currentColor.value.hsv.v}
              onChange={onSaturationChange}
            />

            {!props.disableHue && (
              <Hue
                class="bee-ele-hue"
                vertical={true}
                size="small"
                hue={currentColor.value.hsv.h}
                onChange={onHueChange}
              />
            )}
          </div>

          {!props.disableAlpha && (
            <Alpha
              style="width: 257px"
              color={currentColor.value.hex8}
              onChange={onAlphaChange}
              alpha={currentColor.value.alpha}
            />
          )}

          <VColorInput style="width: 257px" color={currentColor.value} onChange={onInputChange} />

          {!props.disableHistory && (
            <History
              color-list={storageColorList.value}
              round={props.historyRound}
              onChange={onCompactChange}
            />
          )}
        </div>
      );
    };
  },
});
