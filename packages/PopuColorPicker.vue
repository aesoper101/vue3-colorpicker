<template>
  <div
    class="bee-color-wrap transparent"
    :class="{ round: round }"
    ref="colorRef"
  >
    <div class="current-color" :style="getBgColor" @click="onShowPicker"></div>
  </div>
  <teleport to="body">
    <div ref="pickerRef" class="data-popper-arrow">
      <component
        :is="mode + '-color-picker'"
        v-model:color="currentColor"
        v-click-outside="onHidePicker"
        v-bind="pickerProps"
        @change="onColorChange"
        v-if="showPicker"
      />
    </div>
  </teleport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  watch
} from "vue";
import { Color, ColorInput } from "./color";
import { createPopper } from "@popperjs/core";
import FkColorPicker from "./fk/index.vue";

export type PickerMode = "fk" | "chrome" | "ele";

export default defineComponent({
  name: "PopuColorPicker",
  components: { FkColorPicker },
  props: {
    color: {
      type: [String, Object] as PropType<ColorInput>,
      default: "#000000"
    },
    round: {
      type: Boolean
    },
    mode: {
      type: String as PropType<PickerMode>,
      default: "chrome"
    },
    pickerProps: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  setup(props, { emit }) {
    const showPicker = ref(false);
    const colorRef = ref<HTMLElement | null>(null);
    const pickerRef = ref<HTMLElement | null>(null);
    const currentColor = ref(props.color);

    const getBgColor = computed(() => {
      const colorCls = new Color();
      colorCls.parseColor(currentColor.value);
      return {
        background: colorCls.format("hex8")
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
                fallbackPlacements: ["top", "left"]
              }
            }
          ]
        });
      }
    };

    const onColorChange = () => {
      emit("update:color", currentColor.value);
    };

    watch(
      () => props.color,
      color => {
        currentColor.value = color;
      }
    );

    onMounted(() => {
      onInit();
    });

    return {
      currentColor,
      pickerRef,
      colorRef,
      showPicker,
      getBgColor,
      onColorChange,
      onShowPicker,
      onHidePicker
    };
  }
});
</script>

<style lang="scss" scoped>
.bee-color-wrap {
  margin-right: 10px;
  width: 50px;
  height: 24px;
  box-shadow: 3px 0 5px #00000014;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;

  &.transparent {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
    background-repeat: repeat;
  }

  &.round {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid #d8d8d8;
  }

  .current-color {
    width: 100%;
    height: 100%;
  }
}
</style>
