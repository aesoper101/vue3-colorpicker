import { defineComponent, getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
import { DOMUtils } from "@aesoper/normal-utils";

const clamp = (value: number, min: number, max: number) => {
  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value;
};

export default defineComponent({
  name: "Saturation",
  props: {
    hue: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 360;
      },
    },
    saturation: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 1;
      },
    },
    value: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 1;
      },
    },
    round: Boolean,
    hidden: Boolean,
  },
  emits: ["update:saturation", "update:value", "change"],
  setup(props, { emit }) {
    // instance
    const instance = getCurrentInstance();
    // data
    const cursorTop = ref(0);
    const cursorLeft = ref(0);
    const background = ref("hsl(" + props.hue + ", 100%, 50%)");
    const currentHsv = reactive({
      h: props.hue,
      s: props.saturation,
      v: props.value,
    });

    const updatePosition = () => {
      if (instance) {
        const el = instance.vnode.el;
        cursorLeft.value = currentHsv.s * el?.clientWidth;
        cursorTop.value = (1 - currentHsv.v) * el?.clientHeight;
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

        const saturation = Math.round((left / rect.width) * 100) / 100;
        const bright = Math.round(clamp(-(top / rect.height) + 1, 0, 1) * 100) / 100;

        cursorLeft.value = left;
        cursorTop.value = top;

        currentHsv.s = saturation;
        currentHsv.v = bright;

        emit("update:saturation", saturation);
        emit("update:value", bright);
        emit("change", saturation, bright);
      }
    };

    onMounted(() => {
      if (instance && instance.vnode.el) {
        DOMUtils.triggerDragEvent(instance.vnode.el as HTMLElement, {
          drag: (event: Event) => {
            handleDrag(event as MouseEvent);
          },
          end: (event) => {
            handleDrag(event as MouseEvent);
          },
        });

        updatePosition();
      }
    });

    // watch
    watch(
      () => props.hue,
      (hue: number) => {
        currentHsv.h = hue;
        background.value = "hsl(" + Math.round(currentHsv.h) + ", 100%, 50%)";
      }
    );

    watch(
      () => props.value,
      (value: number) => {
        currentHsv.v = value;
        updatePosition();
      }
    );

    watch(
      () => props.saturation,
      (saturation: number) => {
        currentHsv.s = saturation;
        updatePosition();
      }
    );

    return () => {
      const wrapClass = [
        "bee-saturation",
        {
          "bee-saturation__chrome": props.round,
          "bee-saturation__hidden": props.hidden,
        },
      ];
      return (
        <div class={wrapClass} style={{ backgroundColor: background.value }}>
          <div class="bee-saturation__white" />
          <div class="bee-saturation__black" />
          <div
            class="bee-saturation__cursor"
            style={{
              top: cursorTop.value + "px",
              left: cursorLeft.value + "px",
            }}
            onClick={handleDrag}
          >
            <div />
          </div>
        </div>
      );
    };
  },
});
