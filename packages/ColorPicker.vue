<template>
  <div
    :class="['vc-color-wrap', 'transparent', { round: round }]"
    v-if="!isWidget"
    ref="colorCubeRef"
  >
    <div class="current-color" :style="getBgColorStyle" @click="onShowPicker"></div>
  </div>
  <FkColorPicker
    v-if="isWidget && pickerType === 'fk'"
    v-model:color="colorInstance"
    :disable-history="disableHistory"
    :round-history="roundHistory"
    @change="onColorChange"
  />
  <ChromeColorPicker
    v-if="isWidget && pickerType === 'chrome'"
    v-model:color="colorInstance"
    :disable-history="disableHistory"
    :round-history="roundHistory"
    @change="onColorChange"
  />
  <teleport to="body" v-if="!isWidget">
    <div ref="pickerRef" v-show="showPicker">
      <FkColorPicker
        v-if="pickerType === 'fk' && showPicker"
        v-model:color="colorInstance"
        :disable-history="disableHistory"
        :round-history="roundHistory"
        @change="onColorChange"
      />
      <ChromeColorPicker
        v-if="pickerType === 'chrome' && showPicker"
        v-model:color="colorInstance"
        :disable-history="disableHistory"
        :round-history="roundHistory"
        @change="onColorChange"
      />
    </div>
  </teleport>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, reactive, ref } from "vue";
  import FkColorPicker from "./fk/FkColorPicker.vue";
  import ChromeColorPicker from "./chrome/ChromeColorPicker.vue";
  import tinycolor, { ColorInputWithoutInstance } from "tinycolor2";
  import propTypes from "vue-types";
  import { Color, ColorFormat } from "./utils/color";
  import { onClickOutside, tryOnMounted, whenever } from "@vueuse/core";
  import { createPopper } from "@popperjs/core";

  export default defineComponent({
    name: "ColorPicker",
    components: { FkColorPicker, ChromeColorPicker },
    inheritAttrs: false,
    props: {
      isWidget: propTypes.bool.def(false),
      pickerType: propTypes.oneOf(["fk", "chrome"]).def("fk"),
      round: propTypes.bool.def(false),
      color: {
        type: [String, Object] as PropType<ColorInputWithoutInstance>,
        default: "#000000",
      },
      format: {
        type: String as PropType<ColorFormat>,
        default: "hex",
      },
      disableHistory: propTypes.bool.def(false),
      roundHistory: propTypes.bool.def(false),
    },
    emits: ["update:color", "change"],
    setup(props, { emit }) {
      const state = reactive({
        color: props.color || "",
      });

      const instance = new Color(state.color);
      const colorInstance = ref(instance);

      // Ref
      const showPicker = ref(false);
      const colorCubeRef = ref<HTMLElement | null>(null);
      const pickerRef = ref<HTMLElement | null>(null);

      const getBgColorStyle = computed(() => {
        return {
          background: tinycolor(state.color).toRgbString(),
        };
      });

      const onShowPicker = () => {
        showPicker.value = true;
      };

      const onHidePicker = () => {
        showPicker.value = false;
      };

      const onInit = () => {
        if (colorCubeRef.value && pickerRef.value) {
          createPopper(colorCubeRef.value, pickerRef.value, {
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

      const onColorChange = (v: Color) => {
        colorInstance.value = v;
        state.color = v.toString(props.format);

        emit("update:color", state.color);
        emit("change", state.color);
      };

      onClickOutside(pickerRef, () => {
        onHidePicker();
      });

      tryOnMounted(() => {
        onInit();
      });

      whenever(
        () => props.color,
        (value) => {
          const equal = tinycolor.equals(value, state.color);

          if (!equal) {
            state.color = value;
            colorInstance.value = new Color(value);
          }
        },
        { deep: true }
      );

      return {
        colorCubeRef,
        pickerRef,
        showPicker,
        colorInstance,
        getBgColorStyle,
        onColorChange,
        onShowPicker,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-color-wrap {
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
