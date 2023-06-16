<template>
  <div :class="['vc-lightness-slider', { 'small-slider': size === 'small' }]">
    <div
      ref="barElement"
      class="vc-lightness-slider__bar"
      :style="getBackgroundStyle"
      @click="onClickSider"
    >
      <div
        :class="['vc-lightness-slider__bar-pointer', { 'small-bar': size === 'small' }]"
        ref="cursorElement"
        :style="getCursorStyle"
      >
        <div class="vc-lightness-slider__bar-handle"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, CSSProperties, defineComponent, reactive, ref, watch } from "vue";
  import propTypes from "vue-types";
  import { Color } from "../utils/color";
  import { tryOnMounted } from "@vueuse/core";
  import { DOMUtils, DragEventOptions } from "@aesoper/normal-utils";
  import { merge } from "lodash-es";
  import tinycolor from "tinycolor2";

  export default defineComponent({
    name: "Lightness",
    props: {
      color: propTypes.instanceOf(Color),
      size: propTypes.oneOf(["small", "default"]).def("default"),
    },
    emits: ["change"],
    setup(props, { emit }) {
      const barElement = ref<HTMLElement | null>(null);
      const cursorElement = ref<HTMLElement | null>(null);

      let color = props.color || new Color();
      const [h, s, l] = color.HSL;

      const state = reactive({
        hue: h,
        saturation: s,
        lightness: l,
      });

      watch(
        () => props.color,
        (value) => {
          if (value) {
            color = value;
            const [hue, saturation, lightness] = color.HSL;
            merge(state, {
              hue,
              saturation,
              lightness,
            });
          }
        },
        { deep: true }
      );

      const getBackgroundStyle = computed(() => {
        const color1 = tinycolor({
          h: state.hue,
          s: state.saturation,
          l: 0.8,
        }).toPercentageRgbString();
        const color2 = tinycolor({
          h: state.hue,
          s: state.saturation,
          l: 0.6,
        }).toPercentageRgbString();
        const color3 = tinycolor({
          h: state.hue,
          s: state.saturation,
          l: 0.4,
        }).toPercentageRgbString();
        const color4 = tinycolor({
          h: state.hue,
          s: state.saturation,
          l: 0.2,
        }).toPercentageRgbString();
        return {
          background: [
            `linear-gradient(to right, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`,
            `-webkit-linear-gradient(left, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`,
            `-moz-linear-gradient(left, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`,
            `-ms-linear-gradient(left, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`,
          ],
        } as any as CSSProperties;
      });

      const getCursorLeft = () => {
        if (barElement.value && cursorElement.value) {
          const lightness = state.lightness;
          const rect = barElement.value.getBoundingClientRect();
          const offsetWidth = cursorElement.value.offsetWidth;

          return (1 - lightness) * (rect.width - offsetWidth) + offsetWidth / 2;
        }

        return 0;
      };

      const getCursorStyle = computed(() => {
        const left = getCursorLeft();
        return {
          left: left + "px",
          top: 0,
        };
      });

      const onClickSider = (event: Event) => {
        const target = event.target;

        if (target !== barElement.value) {
          onMoveBar(event as MouseEvent);
        }
      };

      const onMoveBar = (event: MouseEvent) => {
        event.stopPropagation();
        if (barElement.value && cursorElement.value) {
          const rect = barElement.value.getBoundingClientRect();

          const offsetWidth = cursorElement.value.offsetWidth;

          let left = event.clientX - rect.left;
          left = Math.max(offsetWidth / 2, left);
          left = Math.min(left, rect.width - offsetWidth / 2);

          const light = 1 - (left - offsetWidth / 2) / (rect.width - offsetWidth);
          color.lightness = light;
          emit("change", light);
        }
      };

      tryOnMounted(() => {
        const dragConfig: DragEventOptions = {
          drag: (event: Event) => {
            onMoveBar(event as MouseEvent);
          },
          end: (event: Event) => {
            onMoveBar(event as MouseEvent);
          },
        };

        if (barElement.value && cursorElement.value) {
          DOMUtils.triggerDragEvent(barElement.value, dragConfig);
        }
      });

      return { barElement, cursorElement, getCursorStyle, getBackgroundStyle, onClickSider };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-lightness-slider {
    position: relative;
    margin-bottom: 15px;
    width: 100%;
    height: 14px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
    border-radius: 15px;

    &.is-vertical {
      width: 14px;
      height: 100%;
      display: inline-block;
      transform: rotate(180deg);
    }

    &.transparent {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
      background-repeat: repeat;
    }

    &__bar {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 15px;

      &-pointer {
        position: absolute;
        width: 14px;
        height: 14px;
      }

      &-handle {
        width: 14px;
        height: 14px;
        border-radius: 6px;
        transform: translate(-7px, -2px);
        background-color: #f8f8f8;
        margin-top: 2px;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
        cursor: pointer;

        &.vertical {
          transform: translate(0, -7px);
          margin-top: 0;
        }
      }
    }

    &.small-slider {
      height: 10px !important;

      .small-bar {
        height: 10px !important;
        width: 10px !important;

        div {
          width: 12px !important;
          height: 12px !important;
          border-radius: 5px !important;
          transform: translate(-6px, -2px);
          margin-top: 1px !important;
        }
      }
    }
  }
</style>
