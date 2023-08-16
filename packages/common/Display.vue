<template>
  <div class="vc-display">
    <div class="vc-current-color vc-transparent">
      <div class="color-cube" :style="getBgColorStyle"></div>
    </div>
    <template v-if="inputType === 'hex'">
      <div style="display: flex; flex: 1; gap: 4px; height: 100%">
        <div class="vc-color-input">
          <input :value="state.hex" @input="onInputChange" />
        </div>
        <div class="vc-alpha-input" v-if="!disableAlpha">
          <input class="vc-alpha-input__inner" :value="state.alpha" @input="onAlphaBlur" />
        </div>
      </div>
    </template>
    <template v-else-if="state.rgba">
      <div style="display: flex; flex: 1; gap: 4px; height: 100%">
        <div class="vc-rgb-input" v-for="(v, i) in state.rgba" :key="i">
          <div>
            <input :value="v" @input="(e) => onInputChange(e, i)" />
          </div>
          <div>{{ ["R", "G", "B", "A"][i] }}</div>
        </div>
      </div>
    </template>

    <div class="vc-input-toggle" @click="onInputTypeChange"></div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref } from "vue";
  import propTypes from "vue-types";
  import { Color } from "../utils/color";
  import { whenever, useDebounceFn } from "@vueuse/core";
  import tinycolor from "tinycolor2";

  export default defineComponent({
    name: "Display",
    props: {
      color: propTypes.instanceOf(Color),
      disableAlpha: propTypes.bool.def(false),
    },
    emits: ["update:color", "change"],
    setup(props, { emit }) {
      const inputType = ref<"hex" | "rgba">("hex");
      const state = reactive({
        color: props.color,
        hex: props.color?.hex,
        alpha: props.color?.alpha + "%",
        rgba: props.color?.RGB,
        previewBgColor: props.color?.toRgbString(),
      });

      const getBgColorStyle = computed(() => {
        return {
          background: state.previewBgColor,
        };
      });

      const onInputTypeChange = () => {
        inputType.value = inputType.value === "rgba" ? "hex" : "rgba";
      };

      const onAlphaBlur = useDebounceFn((event) => {
        if (!event.target.value) {
          return;
        }

        let opacity = parseInt(event.target.value.replace("%", ""));

        if (opacity > 100) {
          event.target.value = "100%";
          opacity = 100;
        }

        if (opacity < 0) {
          event.target.value = "0%";
          opacity = 0;
        }

        if (isNaN(opacity)) {
          event.target.value = "100%";
          opacity = 100;
        }

        if (!isNaN(opacity) && state.color) {
          state.color.alpha = opacity;
        }

        emit("update:color", state.color);
        emit("change", state.color);
      }, 300);

      const onInputChange = useDebounceFn((event, key?: number) => {
        console.log(event.target.value);
        if (!event.target.value) {
          return;
        }

        if (inputType.value === "hex") {
          const _hex = event.target.value.replace("#", "");
          if (tinycolor(_hex).isValid() && state.color) {
            state.color.hex = _hex;
          }
        } else if (key !== undefined && state.rgba && state.color) {
          if (event.target.value < 0) {
            event.target.value = 0;
          }

          if (key === 3 && event.target.value > 1) {
            event.target.value = 1;
          }

          if (key < 3 && event.target.value > 255) {
            event.target.value = 255;
          }

          state.rgba[key] = Number(event.target.value);
          const [r, g, b, a] = state.rgba;
          state.color.hex = tinycolor({ r, g, b }).toHex();
          state.color.alpha = Math.floor(a * 100);
        }

        emit("update:color", state.color);
        emit("change", state.color);
      }, 300);

      whenever(
        () => props.color,
        (value: Color) => {
          if (value) {
            state.color = value;
            state.alpha = Math.floor(state.color.alpha) + "%";
            state.hex = state.color.hex;
            state.rgba = state.color.RGB;
          }
        },
        { deep: true }
      );

      whenever(
        () => state.color,
        () => {
          if (state.color) {
            state.previewBgColor = state.color.toRgbString();
          }
        },
        { deep: true }
      );

      return { state, getBgColorStyle, inputType, onInputTypeChange, onAlphaBlur, onInputChange };
    },
  });
</script>

<style lang="scss" scoped>
  $backGroundColor: rgba(200, 200, 200, 0.25);
  $color: #666;

  .vc-display {
    height: 28px;
    display: flex;
    align-items: center;
    gap: 8px;

    .vc-current-color {
      width: 50px;
      height: 100%;
      box-shadow: 3px 0 5px #00000014;
      border-radius: 2px;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;

      &.vc-transparent {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
        background-repeat: repeat;
      }

      .color-cube {
        width: 100%;
        height: 100%;
      }
    }

    .vc-color-input {
      height: 100%;
      flex: 1;
      flex-shrink: 0;
      box-sizing: border-box;
      position: relative;

      input {
        padding: 0;
        border: 0;
        outline: none;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        box-sizing: border-box;
        background-color: $backGroundColor;
        color: $color;
        border-radius: 2px;
        height: 100%;
        width: 100%;
      }
    }

    .vc-rgb-input {
      flex: 1;
      font-size: 12px;
      color: $color;
      text-align: center;

      input {
        padding: 4px 0;
        margin-bottom: 2px;
        border: 0;
        outline: none;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        background-color: $backGroundColor;
        color: $color;
        border-radius: 2px;
        width: 100%;
      }
    }

    .vc-alpha-input {
      width: 56px;
      height: 100%;
      border: none;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: center;
      justify-content: center;
      -ms-flex-align: center;
      align-items: center;
      border-radius: 2px;
      font-size: 14px;

      > input {
        width: 100%;
        height: 100%;
        padding: 0;
        text-align: center;
        background-color: $backGroundColor;
        color: $color;
        font-size: inherit;
      }

      &__inner {
        padding: 10px 16px;
        border-radius: 4px;
        color: #000;
        font-size: 14px;
        line-height: 20px;
        outline: none;
        border: none;
        display: block;
        box-sizing: border-box;
        cursor: pointer;
      }
    }

    .vc-input-toggle {
      height: 10px;
      width: 8px;
      padding: 4px;
      cursor: pointer;

      &:hover {
        background-color: #efefef;
      }

      &::before {
        content: "";
        display: block;
        border-bottom: 4px solid #888;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        margin-bottom: 2px;
      }

      &::after {
        content: "";
        display: block;
        border-top: 4px solid #888;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
      }
    }
  }
</style>
