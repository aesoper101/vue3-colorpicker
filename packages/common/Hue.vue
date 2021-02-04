<template>
  <div
    class="bee-hue-colorPicker transparent"
    :class="{
      'is-vertical': vertical,
      'small-hue-slider': size === 'small' && !vertical
    }"
  >
    <div class="bee-hue-colorPicker__inner" ref="bar" :style="linearGradient">
      <div
        class="bee-hue-colorPicker__inner-pointer"
        :class="{ 'small-bar': size === 'small' && !vertical }"
        ref="barHandle"
        :style="{
          left: handleLeft + 'px',
          top: handleTop + 'px'
        }"
      >
        <div
          class="bee-hue-colorPicker__inner-handle"
          :class="{ vertical: vertical }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch
} from "vue";

import { DOMUtils, DragEventOptions } from "@aesoper/normal-utils";

const bg =
  "-webkit-linear-gradient(left, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66%, rgb(0, 255, 0) 33.33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66%, rgb(255, 0, 255) 83.33%, rgb(255, 0, 0) 100%)";
const verticalBg =
  "-webkit-linear-gradient(bottom, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66%, rgb(0, 255, 0) 33.33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66%, rgb(255, 0, 255) 83.33%, rgb(255, 0, 0) 100%)";

export default defineComponent({
  name: "Hue",
  props: {
    vertical: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "default"
    },
    hue: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 360;
      }
    }
  },
  emits: ["update:hue", "change"],
  setup(props, { emit }) {
    const bar = ref<HTMLElement | null>(null);
    const barHandle = ref<HTMLElement | null>(null);

    const handleLeft = ref(0);
    const handleTop = ref(0);

    const currentHue = ref(props.hue);

    const linearGradient = computed(() => {
      return {
        background: props.vertical ? verticalBg : bg
      };
    });

    const getBarLeftPosition = () => {
      if (props.vertical) return 0;
      if (bar.value && barHandle.value) {
        const rect = bar.value?.getBoundingClientRect();

        if (currentHue.value === 360) {
          return rect.width - barHandle.value.offsetWidth / 2;
        }
        return (
          ((currentHue.value % 360) *
            (rect.width - barHandle.value.offsetWidth)) /
            360 +
          barHandle.value.offsetWidth / 2
        );
      }

      return 0;
    };

    const getBarTopPosition = () => {
      if (!props.vertical) return 0;
      if (bar.value && barHandle.value) {
        const rect = bar.value?.getBoundingClientRect();

        if (currentHue.value === 360) {
          return barHandle.value?.offsetHeight / 2;
        }
        return (
          ((360 - (currentHue.value % 360)) *
            (rect.height - barHandle.value.offsetHeight)) /
            360 +
          barHandle.value.offsetHeight / 2
        );
      }

      return 0;
    };

    const updatePosition = () => {
      handleLeft.value = getBarLeftPosition();
      handleTop.value = getBarTopPosition();
    };

    const handleDrag = (event: MouseEvent) => {
      if (bar.value && barHandle.value) {
        const rect = bar.value?.getBoundingClientRect();

        if (!props.vertical) {
          let left = event.clientX - rect.left;
          left = Math.min(left, rect.width - barHandle.value.offsetWidth / 2);
          left = Math.max(barHandle.value.offsetWidth / 2, left);

          currentHue.value = Math.round(
            ((left - barHandle.value.offsetWidth / 2) /
              (rect.width - barHandle.value.offsetWidth)) *
              360
          );
        } else {
          let top = event.clientY - rect.top;
          top = Math.min(top, rect.height - barHandle.value?.offsetHeight / 2);
          top = Math.max(barHandle.value.offsetHeight / 2, top);

          currentHue.value = Math.round(
            ((top - barHandle.value.offsetHeight / 2) /
              (rect.height - barHandle.value.offsetHeight)) *
              360
          );
        }

        emit("update:hue", currentHue.value);
        emit("change", currentHue.value);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (target !== barHandle.value) {
        handleDrag(event);
      }
    };

    watch(
      () => props.hue,
      (hue: number) => {
        currentHue.value = hue;
      }
    );

    watch(
      () => currentHue.value,
      () => {
        updatePosition();
      }
    );

    onMounted(() => {
      nextTick(() => {
        const dragConfig: DragEventOptions = {
          drag: (event: Event) => {
            handleDrag(event as MouseEvent);
          },
          end: (event: Event) => {
            handleDrag(event as MouseEvent);
          }
        };

        if (bar.value && barHandle.value) {
          DOMUtils.triggerDragEvent(bar.value, dragConfig);
          DOMUtils.triggerDragEvent(barHandle.value, dragConfig);
        }
        updatePosition();
      });
    });

    return {
      bar,
      barHandle,
      linearGradient,
      handleLeft,
      handleTop,
      handleClick
    };
  }
});
</script>

<style lang="scss" scoped>
.small-hue-slider {
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
.bee-hue-colorPicker {
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

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAAAdCAYAAAAAaUg8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKtJREFUeNrs09EKgjAUgOGzEFfv/7CVBceiLiJiLnf7fSAbDoUj/iWnyKgRcXxf9Wtt7Vvntf8854jLY3uN19qzf67nH/e2nmmdZ8xjg2x+sI533qf9g4wM/3GvLPumOHVMWf/4SiWWsUG6/6bG+/NWDgE0iQREAiIBkYBIQCQgEhAJiAQQCYgERAIiAZGASEAkIBJAJCASEAmIBEQCIgGRgEgAkYBIYNAqwAD5oWo3bpsiKwAAAABJRU5ErkJggg==);
    background-size: 100%;

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
      //background-color: #fff;
      background-color: #f8f8f8;
      margin-top: 2px;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
      cursor: pointer;

      &.vertical {
        transform: translate(-1px, -7px);
        margin-top: 0;
      }
    }
  }
}
</style>
