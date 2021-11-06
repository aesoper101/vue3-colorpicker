<template>
  <div class="vc-color-wrap transparent" v-if="!isWidget">
    <div class="current-color"></div>
  </div>
  <FkColorPicker
    v-if="isWidget && pickerType === 'fk'"
    v-model:color="colorInstance"
    @change="onColorChange"
  />
  <ChromeColorPicker
    v-if="isWidget && pickerType === 'chrome'"
    v-model:color="colorInstance"
    @change="onColorChange"
  />
  <teleport to="body" v-if="!isWidget">
    <FkColorPicker
      v-if="pickerType === 'fk'"
      v-model:color="colorInstance"
      @change="onColorChange"
    />
    <ChromeColorPicker
      v-if="pickerType === 'chrome'"
      v-model:color="colorInstance"
      @change="onColorChange"
    />
  </teleport>
</template>

<script lang="ts">
  import { defineComponent, PropType, reactive, ref } from "vue";
  import FkColorPicker from "./fk/FkColorPicker.vue";
  import ChromeColorPicker from "./chrome/ChromeColorPicker.vue";
  import tinycolor, { ColorInputWithoutInstance } from "tinycolor2";
  import propTypes from "vue-types";
  import { Color, ColorFormat } from "./utils/color";
  import { whenever } from "@vueuse/core";

  const pickerProps = propTypes.shape({
    disableHistory: propTypes.bool.def(false),
    round: propTypes.bool.def(false),
  }).loose;

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
      options: pickerProps,
    },
    emits: ["update:color", "change"],
    setup(props, { emit }) {
      const state = reactive({
        color: props.color || "",
      });

      const instance = new Color(state.color);
      const colorInstance = ref(instance);

      const onColorChange = (v: Color) => {
        colorInstance.value = v;
        state.color = v.toString(props.format);

        emit("update:color", state.color);
        emit("change", state.color);
      };

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

      return { colorInstance, onColorChange };
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
