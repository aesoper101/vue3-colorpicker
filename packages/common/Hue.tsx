import { computed, defineComponent, nextTick, onMounted, ref, watch } from "vue";

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
      default: false,
    },
    size: {
      type: String,
      default: "default",
    },
    hue: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 360;
      },
    },
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
        background: props.vertical ? verticalBg : bg,
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
          ((currentHue.value % 360) * (rect.width - barHandle.value.offsetWidth)) / 360 +
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
          ((360 - (currentHue.value % 360)) * (rect.height - barHandle.value.offsetHeight)) / 360 +
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
          },
        };

        if (bar.value && barHandle.value) {
          DOMUtils.triggerDragEvent(bar.value, dragConfig);
          DOMUtils.triggerDragEvent(barHandle.value, dragConfig);
        }
        updatePosition();
      });
    });

    return () => {
      const wrapClass = [
        "bee-hue-colorPicker",
        "transparent",
        {
          "is-vertical": props.vertical,
          "small-hue-slider": props.size === "small" && !props.vertical,
        },
      ];
      return (
        <div class={wrapClass} onClick={handleClick}>
          <div class="bee-hue-colorPicker__inner" ref={bar} style={linearGradient.value}>
            <div
              class={[
                "bee-hue-colorPicker__inner-pointer",
                { "small-bar": props.size === "small" && !props.vertical },
              ]}
              ref={barHandle}
              style={{
                left: handleLeft.value + "px",
                top: handleTop.value + "px",
              }}
            >
              <div class={["bee-hue-colorPicker__inner-handle", { vertical: props.vertical }]} />
            </div>
          </div>
        </div>
      );
    };
  },
});
