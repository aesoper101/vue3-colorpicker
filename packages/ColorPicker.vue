<template>
  <div
    class="bee-color-wrap transparent"
    :class="{ round: shape === 'round' }"
    ref="colorRef"
  >
    <div class="current-color" :style="getBgColor" @click="onShowPicker"></div>
  </div>
  <teleport to="body">
    <div
      :style="getPickerPosition"
      ref="pickerRef"
      v-if="showPicker"
      v-click-outside="onHidePicker"
    >
      <component :is="mode" v-bind="pickerProps" @change="onColorChange" />
    </div>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import Fk from "./fk/index.vue";
import Chrome from "./chrome/index.vue";

export default defineComponent({
  name: "ColorPicker",
  components: { Chrome, Fk },
  props: {
    color: {
      type: String,
      default: "#000000"
    },
    mode: {
      type: String,
      default: "chrome"
    },
    disableAlpha: Boolean,
    disableLight: Boolean,
    disableHue: Boolean,
    disableHistory: Boolean,
    shape: {
      type: String,
      default: "square"
    }
  },
  setup(props, { emit }) {
    const showPicker = ref(false);
    const topPosition = ref(0);
    const leftPosition = ref(0);
    const colorRef = ref<HTMLElement | null>(null);
    const pickerRef = ref<HTMLElement | null>(null);

    const pickerProps = reactive({
      disableAlpha: props.disableAlpha,
      disableLight: props.disableLight,
      disableHue: props.disableHue,
      disableHistory: props.disableHistory,
      color: props.color
    });

    const getBgColor = computed(() => {
      return {
        background: props.color
      };
    });

    const getPickerPosition = computed(() => {
      return {
        position: "fixed",
        left: leftPosition.value + "px",
        top: topPosition.value + "px"
      };
    });

    const onShowPicker = () => {
      showPicker.value = true;
    };

    const onHidePicker = () => {
      showPicker.value = false;
    };

    const onColorChange = (color: string) => {
      pickerProps.color = color;
      emit("update:color", color);
    };

    watch(
      () => props.color,
      (color: string) => {
        if (color !== pickerProps.color) {
          pickerProps.color = color;
        }
      }
    );

    watch(
      () => pickerRef.value,
      () => {
        if (pickerRef.value && colorRef.value) {
          // TODO 需要考虑超出编辑的情况
          leftPosition.value =
            colorRef.value.offsetLeft +
            colorRef.value.offsetWidth / 2 -
            pickerRef.value.offsetWidth;
          topPosition.value =
            colorRef.value.offsetTop -
            colorRef.value.offsetHeight / 2 -
            pickerRef.value.offsetHeight / 2;
        }
      }
    );

    return {
      pickerRef,
      colorRef,
      pickerProps,
      showPicker,
      getBgColor,
      getPickerPosition,
      onShowPicker,
      onHidePicker,
      onColorChange
    };
  }
});
</script>

<style lang="scss" scoped>
.bee-color-wrap {
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
