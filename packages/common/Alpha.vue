<template>
  <div :class="['vc-alpha-slider', 'transparent', { 'small-slider': size === 'small' }]">
    <div
      ref="barElement"
      class="vc-alpha-slider__bar"
      :style="getBackgroundStyle"
      @click="onClickSider"
    >
      <div
        :class="['vc-alpha-slider__bar-pointer', { 'small-bar': size === 'small' }]"
        ref="cursorElement"
        :style="getCursorStyle"
      >
        <div class="vc-alpha-slider__bar-handle"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, watch } from "vue";
  import propTypes from "vue-types";
  import { Color, rgbaColor } from "../utils/color";
  import { tryOnMounted } from "@vueuse/core";
  import { DOMUtils, DragEventOptions } from "@aesoper/normal-utils";
  import { merge } from "lodash-es";

  export default defineComponent({
    name: "Alpha",
    props: {
      color: propTypes.instanceOf(Color),
      size: propTypes.oneOf(["small", "default"]).def("default"),
    },
    emits: ["change"],
    setup(props, { emit }) {
      const barElement = ref<HTMLElement | null>(null);
      const cursorElement = ref<HTMLElement | null>(null);

      let color = props.color || new Color();

      const state = reactive({
        red: color.red,
        green: color.green,
        blue: color.blue,
        alpha: color.alpha,
      });

      watch(
        () => props.color,
        (value) => {
          if (value) {
            color = value;
            merge(state, {
              red: value.red,
              green: value.green,
              blue: value.blue,
              alpha: value.alpha,
            });
          }
        },
        { deep: true }
      );

      const getBackgroundStyle = computed(() => {
        const startColor = rgbaColor(state.red, state.green, state.blue, 0);
        const endColor = rgbaColor(state.red, state.green, state.blue, 100);
        return {
          background: `linear-gradient(to right, ${startColor} , ${endColor})`,
        };
      });

      const getCursorLeft = () => {
        if (barElement.value && cursorElement.value) {
          const alpha = state.alpha / 100;
          const rect = barElement.value.getBoundingClientRect();
          const offsetWidth = cursorElement.value.offsetWidth;

          return Math.round(alpha * (rect.width - offsetWidth) + offsetWidth / 2);
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

          const alpha = Math.round(((left - offsetWidth / 2) / (rect.width - offsetWidth)) * 100);
          color.alpha = alpha;
          state.alpha = alpha;
          emit("change", alpha);
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
  .vc-alpha-slider {
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
