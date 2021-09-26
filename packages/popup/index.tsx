import { computed, defineComponent, onMounted, PropType, ref, watch, Teleport } from "vue";
import { Color, ColorInput } from "../color";
import { createPopper } from "@popperjs/core";
import FkColorPicker from "../fk";
import ChromeColorPicker from "../chrome";
import EleColorPicker from "../ele";

export type PickerMode = "fk" | "chrome" | "ele";

export default defineComponent({
  name: "PopuColorPicker",
  components: { FkColorPicker },
  props: {
    color: {
      type: [String, Object] as PropType<ColorInput>,
      default: "#000000",
    },
    round: {
      type: Boolean,
    },
    mode: {
      type: String as PropType<PickerMode>,
      default: "fk",
    },
    pickerProps: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["update:color", "change"],
  setup(props, { emit }) {
    const showPicker = ref(false);
    const colorRef = ref<HTMLElement | null>(null);
    const pickerRef = ref<HTMLElement | null>(null);
    const currentColor = ref(props.color);

    const getBgColor = computed(() => {
      const colorCls = new Color();
      colorCls.parseColor(currentColor.value);
      return {
        background: colorCls.format("hex8"),
      };
    });

    const onShowPicker = () => {
      showPicker.value = true;
    };

    const onHidePicker = () => {
      showPicker.value = false;
    };

    const onInit = () => {
      if (colorRef.value && pickerRef.value) {
        createPopper(colorRef.value, pickerRef.value, {
          placement: "auto",
          modifiers: [
            // {
            //   name: "offset",
            //   options: {
            //     offset: [10, 10]
            //   }
            // },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["top", "left"],
              },
            },
          ],
        });
      }
    };

    const onColorChange = () => {
      emit("update:color", currentColor.value);
      emit("change", currentColor.value);
    };

    watch(
      () => props.color,
      (color) => {
        currentColor.value = color;
      }
    );

    onMounted(() => {
      onInit();
    });

    return () => {
      const wrapClass = ["bee-color-wrap transparent", { round: props.round }];
      return (
        <>
          <div class={wrapClass} ref={colorRef}>
            <div class="current-color" style={getBgColor.value} onClick={onShowPicker} />
          </div>
          <Teleport to="body">
            <div ref={pickerRef} class="data-popper-arrow">
              {props.mode === "fk" && showPicker.value && (
                <FkColorPicker
                  v-models={[[currentColor.value, "color"]]}
                  v-click-outside={onHidePicker}
                  onChange={onColorChange}
                  {...{ ...props.pickerProps }}
                />
              )}
              {props.mode === "ele" && showPicker.value && (
                <EleColorPicker
                  v-models={[[currentColor.value, "color"]]}
                  v-click-outside={onHidePicker}
                  onChange={onColorChange}
                  {...{ ...props.pickerProps }}
                />
              )}
              {props.mode === "chrome" && showPicker.value && (
                <ChromeColorPicker
                  v-models={[[currentColor.value, "color"]]}
                  v-click-outside={onHidePicker}
                  onChange={onColorChange}
                  {...{ ...props.pickerProps }}
                />
              )}
            </div>
          </Teleport>
        </>
      );
    };
  },
});
