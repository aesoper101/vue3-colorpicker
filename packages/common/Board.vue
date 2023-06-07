<template>
  <div
    ref="boardElement"
    :class="['vc-saturation', { 'vc-saturation__chrome': round, 'vc-saturation__hidden': hide }]"
    :style="{ backgroundColor: state.hueColor }"
    @click="onClickBoard"
  >
    <div class="vc-saturation__white"></div>
    <div class="vc-saturation__black"></div>
    <div class="vc-saturation__cursor" ref="cursorElement" :style="getCursorStyle">
      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, getCurrentInstance, nextTick, reactive, ref } from "vue";
  import propTypes from "vue-types";
  import { clamp, Color } from "../utils/color";
  import { tryOnMounted, whenever } from "@vueuse/core";
  import { merge } from "lodash-es";
  import { DOMUtils } from "@aesoper/normal-utils";

  export default defineComponent({
    name: "Board",
    props: {
      color: propTypes.instanceOf(Color),
      round: propTypes.bool.def(false),
      hide: propTypes.bool.def(true),
    },
    emits: ["change"],
    setup(props, { emit }) {
      const instance = getCurrentInstance();
      const hueHsv = {
        h: props.color?.hue || 0,
        s: 1,
        v: 1,
      };

      const hueColor = new Color(hueHsv).toHexString();

      const state = reactive({
        hueColor,
        saturation: props.color?.saturation || 0,
        brightness: props.color?.brightness || 0,
      });

      const cursorTop = ref(0);
      const cursorLeft = ref(0);

      const cursorElement = ref<HTMLElement | null>();
      const boardElement = ref<HTMLElement | null>();

      const getCursorStyle = computed(() => {
        return {
          top: cursorTop.value + "px",
          left: cursorLeft.value + "px",
        };
      });

      const updatePosition = () => {
        if (instance) {
          const el = instance.vnode.el;
          cursorLeft.value = state.saturation * el?.clientWidth;
          cursorTop.value = (1 - state.brightness) * el?.clientHeight;
        }
      };

      const onClickBoard = (event: Event) => {
        const target = event.target;

        if (target !== boardElement.value) {
          handleDrag(event as MouseEvent);
        }
      };

      const handleDrag = (event: MouseEvent) => {
        if (instance) {
          const el = instance.vnode.el;
          const rect = el?.getBoundingClientRect();

          let left = event.clientX - rect.left;
          let top = event.clientY - rect.top;

          left = clamp(left, 0, rect.width);
          top = clamp(top, 0, rect.height);

          const saturation = left / rect.width;
          const bright = clamp(-(top / rect.height) + 1, 0, 1);

          cursorLeft.value = left;
          cursorTop.value = top;

          state.saturation = saturation;
          state.brightness = bright;

          emit("change", saturation, bright);
        }
      };

      tryOnMounted(() => {
        if (instance && instance.vnode.el && cursorElement.value) {
          DOMUtils.triggerDragEvent(cursorElement.value, {
            drag: (event: Event) => {
              handleDrag(event as MouseEvent);
            },
            end: (event) => {
              handleDrag(event as MouseEvent);
            },
          });

          nextTick(() => {
            updatePosition();
          });
        }
      });

      whenever(
        () => props.color,
        (value) => {
          merge(state, {
            hueColor: new Color({ h: value.hue, s: 1, v: 1 }).toHexString(),
            saturation: value.saturation,
            brightness: value.brightness,
          });
          updatePosition();
        },
        { deep: true }
      );

      return { state, cursorElement, getCursorStyle, onClickBoard };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-saturation {
    position: relative;
    margin-bottom: 15px;
    width: 100%;
    height: 125px;

    &__chrome {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border-color: transparent;
    }

    &__hidden {
      overflow: hidden;
    }

    &__white,
    &__black {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    &__black {
      background: linear-gradient(0deg, #000, transparent);
    }

    &__white {
      background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
    }

    &__cursor {
      position: absolute;

      div {
        transform: translate(-5px, -5px);
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
        width: 10px;
        height: 10px;
        border: 1px solid white;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
</style>
