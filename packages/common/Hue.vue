<template>
  <div :class="['vc-hue-slider', { 'small-slider': size === 'small' }]">
    <div ref="barElement" class="vc-hue-slider__bar" @click="onClickSider">
      <div
        :class="['vc-hue-slider__bar-pointer', { 'small-bar': size === 'small' }]"
        ref="cursorElement"
        :style="getCursorStyle"
      >
        <div class="vc-hue-slider__bar-handle"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, watch } from "vue";
  import propTypes from "vue-types";
  import { Color } from "../utils/color";
  import { tryOnMounted } from "@vueuse/core";
  import { DOMUtils, DragEventOptions } from "@aesoper/normal-utils";
  import { merge } from "lodash-es";

  export default defineComponent({
    name: "Hue",
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
        hue: color.hue || 0,
      });

      watch(
        () => props.color,
        (value) => {
          if (value) {
            color = value;
            merge(state, { hue: color.hue });
          }
        },
        { deep: true }
      );

      const getCursorLeft = () => {
        if (barElement.value && cursorElement.value) {
          const rect = barElement.value.getBoundingClientRect();
          const offsetWidth = cursorElement.value.offsetWidth;
          if (state.hue === 360) {
            return rect.width - offsetWidth / 2;
          }
          return ((state.hue % 360) * (rect.width - offsetWidth)) / 360 + offsetWidth / 2;
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
          left = Math.min(left, rect.width - offsetWidth / 2);
          left = Math.max(offsetWidth / 2, left);

          const hue = Math.round(((left - offsetWidth / 2) / (rect.width - offsetWidth)) * 360);
          color.hue = hue;
          state.hue = hue;
          emit("change", hue);
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

      return { barElement, cursorElement, getCursorStyle, onClickSider };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-hue-slider {
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
      background: linear-gradient(
        to right,
        rgb(255, 0, 0) 0%,
        rgb(255, 255, 0) 16.66%,
        rgb(0, 255, 0) 33.33%,
        rgb(0, 255, 255) 50%,
        rgb(0, 0, 255) 66.66%,
        rgb(255, 0, 255) 83.33%,
        rgb(255, 0, 0) 100%
      );
      background: -webkit-linear-gradient(
        left,
        rgb(255, 0, 0) 0%,
        rgb(255, 255, 0) 16.66%,
        rgb(0, 255, 0) 33.33%,
        rgb(0, 255, 255) 50%,
        rgb(0, 0, 255) 66.66%,
        rgb(255, 0, 255) 83.33%,
        rgb(255, 0, 0) 100%
      );
      background: -moz-linear-gradient(
        left,
        rgb(255, 0, 0) 0%,
        rgb(255, 255, 0) 16.66%,
        rgb(0, 255, 0) 33.33%,
        rgb(0, 255, 255) 50%,
        rgb(0, 0, 255) 66.66%,
        rgb(255, 0, 255) 83.33%,
        rgb(255, 0, 0) 100%
      );
      background: -ms-linear-gradient(
        left,
        rgb(255, 0, 0) 0%,
        rgb(255, 255, 0) 16.66%,
        rgb(0, 255, 0) 33.33%,
        rgb(0, 255, 255) 50%,
        rgb(0, 0, 255) 66.66%,
        rgb(255, 0, 255) 83.33%,
        rgb(255, 0, 0) 100%
      );

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
