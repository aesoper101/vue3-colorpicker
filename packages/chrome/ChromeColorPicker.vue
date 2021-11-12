<template>
  <div class="vc-chrome-colorPicker">
    <Board :round="true" :hide="false" :color="state.color" @change="onBoardChange" />
    <div class="vc-chrome-colorPicker-body">
      <div class="chrome-controls">
        <div class="chrome-color-wrap transparent">
          <div class="current-color" :style="previewStyle"></div>
        </div>
        <div class="chrome-sliders">
          <Hue size="small" :color="state.color" @change="onHueChange" />
          <Alpha size="small" :color="state.color" @change="onAlphaChange" v-if="!disableAlpha" />
        </div>
      </div>
      <Display :color="state.color" :disable-alpha="disableAlpha" />
      <History
        :round="roundHistory"
        :colors="historyColors"
        v-if="!disableHistory"
        @change="onCompactChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive } from "vue";
  import Alpha from "../common/Alpha.vue";
  import Board from "../common/Board.vue";
  import Hue from "../common/Hue.vue";
  import History from "../common/History.vue";
  import propTypes from "vue-types";
  import { Color, HistoryColorKey, MAX_STORAGE_LENGTH } from "../utils/color";
  import { useDebounceFn, useLocalStorage, whenever } from "@vueuse/core";
  import tinycolor from "tinycolor2";
  import Display from "../common/Display.vue";

  export default defineComponent({
    name: "ChromeColorPicker",
    components: { Display, Alpha, Board, Hue, History },
    props: {
      color: propTypes.instanceOf(Color),
      disableHistory: propTypes.bool.def(false),
      roundHistory: propTypes.bool.def(false),
      disableAlpha: propTypes.bool.def(false),
    },
    emits: ["update:color", "change"],
    setup(props, { emit }) {
      const colorInstance = props.color || new Color();
      const state = reactive({
        color: colorInstance,
        hex: colorInstance.toHexString(),
        rgb: colorInstance.toRgbString(),
      });

      const previewStyle = computed(() => {
        return { background: state.rgb };
      });

      const historyColors = useLocalStorage<string[]>(HistoryColorKey, [], {});

      const updateColorHistoryFn = useDebounceFn(() => {
        if (props.disableHistory) {
          return;
        }
        const rgbString = state.color.toRgbString();

        historyColors.value = historyColors.value.filter((value) => {
          return !tinycolor.equals(value, rgbString);
        });

        if (historyColors.value.includes(rgbString)) {
          return;
        }

        while (historyColors.value.length > MAX_STORAGE_LENGTH) {
          historyColors.value.pop();
        }

        historyColors.value.unshift(rgbString);
      }, 500);

      const onAlphaChange = (alpha: number) => {
        state.color.alpha = alpha;
      };

      const onHueChange = (hue: number) => {
        state.color.hue = hue;
      };

      const onBoardChange = (saturation: number, brightness: number) => {
        state.color.saturation = saturation;
        state.color.brightness = brightness;
      };

      const onCompactChange = (color: string) => {
        if (color !== "advance") {
          state.color.hex = color;
        }
      };

      whenever(
        () => props.color,
        (value: Color) => {
          if (value) {
            state.color = value;
          }
        },
        { deep: true }
      );

      whenever(
        () => state.color,
        () => {
          state.hex = state.color.hex;
          state.rgb = state.color.toRgbString();
          updateColorHistoryFn();
          emit("update:color", state.color);
          emit("change", state.color);
        },
        { deep: true }
      );

      return {
        state,
        previewStyle,
        historyColors,
        onAlphaChange,
        onHueChange,
        onBoardChange,
        onCompactChange,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-chrome-colorPicker {
    position: relative;
    box-sizing: border-box;
    border-radius: 3px;
    user-select: none;
    background-color: white;

    &-body {
      position: relative;
      //padding: 0 12px;
      background-color: #fff;

      .chrome-controls {
        display: flex;

        .chrome-color-wrap {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          z-index: 1;

          &.transparent {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
            background-repeat: repeat;
          }

          .current-color {
            width: 100%;
            height: 100%;
          }
        }

        .chrome-sliders {
          flex: 1;
          margin-left: 10px;
        }
      }
    }
  }
</style>
