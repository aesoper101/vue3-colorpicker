<template>
  <div
    class="bee-alpha-slider transparent"
    :class="{
      'is-vertical': vertical,
      'small-alpha-slider': size === 'small' && !vertical
    }"
  >
    <div
      class="bee-alpha-slider__bar"
      ref="barEle"
      :style="gradientColor"
      @click="onSliderClick"
    >
      <div
        class="bee-alpha-slider__bar-pointer"
        :class="{ 'small-bar': size === 'small' && !vertical }"
        ref="cursorEle"
        :style="{
          left: cursorLeft + 'px',
          top: cursorTop + 'px'
        }"
      >
        <div
          class="bee-alpha-slider__bar-handle"
          :class="{ vertical: vertical }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  nextTick
} from "vue";
import { DOMUtils, DragEventOptions } from "@aesoper/normal-utils";
import tinycolor from "tinycolor2";

export default defineComponent({
  name: "Alpha",
  props: {
    color: {
      type: String,
      default: "#000000"
    },
    vertical: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "default"
    },
    alpha: {
      type: Number,
      default: 1,
      validator: (value: number) => {
        return value >= 0 && value <= 1;
      }
    }
  },
  emits: ["update:alpha", "change"],
  setup(props, { emit }) {
    const barEle = ref<HTMLElement | null>(null);
    const cursorEle = ref<HTMLElement | null>(null);

    const cursorLeft = ref(0);
    const cursorTop = ref(0);

    const currentAlpha = ref(props.alpha);

    const gradientColor = computed(() => {
      const rgb = tinycolor(props.color)
        .setAlpha(1)
        .toRgbString();
      const alphaGgb = tinycolor(props.color)
        .setAlpha(0)
        .toRgbString();

      let deg = "right";
      if (props.vertical) {
        deg = "bottom";
      }
      return {
        background: `linear-gradient(to ${deg}, ${alphaGgb}, ${rgb}`
      };
    });

    const getCursorLeft = () => {
      if (props.vertical) return 0;
      if (barEle.value && cursorEle.value) {
        const alpha = currentAlpha.value;
        const rect = barEle.value?.getBoundingClientRect();

        return Math.round(
          alpha * (rect.width - cursorEle.value?.offsetWidth) +
            cursorEle.value?.offsetWidth / 2
        );
      }

      return 0;
    };

    const getCursorTop = () => {
      if (!props.vertical) return 0;
      if (barEle.value && cursorEle.value) {
        const alpha = currentAlpha.value;
        const rect = barEle.value?.getBoundingClientRect();

        return Math.round(
          alpha * (rect.height - cursorEle.value.offsetHeight) +
            cursorEle.value.offsetHeight / 2
        );
      }
      return 0;
    };

    const updatePosition = () => {
      cursorLeft.value = getCursorLeft();
      cursorTop.value = getCursorTop();
    };

    const onDragSlider = (event: MouseEvent) => {
      event.stopPropagation();
      if (barEle.value && cursorEle.value) {
        const rect = barEle.value?.getBoundingClientRect();

        if (!props.vertical) {
          let left = event.clientX - rect.left;
          left = Math.max(cursorEle.value.offsetWidth / 2, left);
          left = Math.min(left, rect.width - cursorEle.value.offsetWidth / 2);

          currentAlpha.value =
            Math.round(
              ((left - cursorEle.value.offsetWidth / 2) /
                (rect.width - cursorEle.value.offsetWidth)) *
                100
            ) / 100;
        } else {
          let top = event.clientY - rect.top;
          top = Math.max(cursorEle.value.offsetHeight / 2, top);
          top = Math.min(top, rect.height - cursorEle.value.offsetHeight / 2);

          currentAlpha.value =
            1 -
            Math.round(
              ((top - cursorEle.value.offsetHeight / 2) /
                (rect.height - cursorEle.value.offsetHeight)) *
                100
            ) /
              100;
        }

        emit("update:alpha", currentAlpha.value);
        emit("change", currentAlpha.value);
      }
    };

    const onSliderClick = (event: MouseEvent) => {
      const target = event.target;

      if (target !== barEle.value) {
        onDragSlider(event);
      }
    };

    watch(
      () => props.alpha,
      () => {
        currentAlpha.value = props.alpha;
      }
    );

    watch(
      () => currentAlpha.value,
      () => {
        updatePosition();
      }
    );

    onMounted(() => {
      nextTick(() => {
        const dragConfig: DragEventOptions = {
          drag: (event: Event) => {
            onDragSlider(event as MouseEvent);
          },
          end: (event: Event) => {
            onDragSlider(event as MouseEvent);
          }
        };

        if (barEle.value && cursorEle.value) {
          DOMUtils.triggerDragEvent(barEle.value, dragConfig);
          DOMUtils.triggerDragEvent(barEle.value, dragConfig);
        }
      });
      updatePosition();
    });

    return {
      barEle,
      cursorEle,
      cursorLeft,
      cursorTop,
      gradientColor,
      onSliderClick
    };
  }
});
</script>

<style lang="scss" scoped>
.small-alpha-slider {
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

.bee-alpha-slider {
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
        transform: translate(0px, -7px);
        margin-top: 0;
      }
    }
  }
}
</style>
