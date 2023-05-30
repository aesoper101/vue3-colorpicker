<template>
  <div class="vc-fk-colorPicker">
    <div class="vc-fk-colorPicker__inner">
      <div class="vc-fk-colorPicker__header">
        <span style="cursor: pointer" v-if="advancePanelShow" @click="onBack">
          <div class="back"></div>
        </span>
      </div>
      <Palette v-if="!advancePanelShow" @change="onCompactChange" />
      <Board v-if="advancePanelShow" :color="state.color" @change="onBoardChange" />
      <Hue v-if="advancePanelShow" :color="state.color" @change="onHueChange" />
      <Lightness v-if="!advancePanelShow" :color="state.color" @change="onLightChange" />
      <Alpha v-if="!disableAlpha" :color="state.color" @change="onAlphaChange" />
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
  import { computed, defineComponent, reactive, ref } from "vue";
  import Alpha from "../common/Alpha.vue";
  import Palette from "../common/Palette.vue";
  import Board from "../common/Board.vue";
  import Hue from "../common/Hue.vue";
  import Lightness from "../common/Lightness.vue";
  import History from "../common/History.vue";
  import propTypes from "vue-types";
  import { Color, HistoryColorKey, MAX_STORAGE_LENGTH } from "../utils/color";
  import { useDebounceFn, useLocalStorage, whenever } from "@vueuse/core";
  import tinycolor from "tinycolor2";
  import Display from "../common/Display.vue";

  export default defineComponent({
    name: "FkColorPicker",
    components: { Display, Alpha, Palette, Board, Hue, Lightness, History },
    props: {
      color: propTypes.instanceOf(Color),
      disableHistory: propTypes.bool.def(false),
      roundHistory: propTypes.bool.def(false),
      disableAlpha: propTypes.bool.def(false),
    },
    emits: ["update:color", "change", "advanceChange"],
    setup(props, { emit }) {
      const colorInstance = props.color || new Color();
      const state = reactive({
        color: colorInstance,
        hex: colorInstance.toHexString(),
        rgb: colorInstance.toRgbString(),
      });

      const advancePanelShow = ref(false);

      const previewStyle = computed(() => {
        return { background: state.rgb };
      });

      const onBack = () => {
        advancePanelShow.value = false;
        emit("advanceChange", false);
      };

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

      const onCompactChange = (color: string) => {
        if (color === "advance") {
          advancePanelShow.value = true;
          emit("advanceChange", true);
        } else {
          state.color.hex = color;
          emit("advanceChange", false);
        }
      };

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

      const onLightChange = (light: number) => {
        state.color.lightness = light;
      };

      const onInputChange = (event: FocusEvent) => {
        const target = event.target as HTMLInputElement;
        const hex = target.value.replace("#", "");
        if (tinycolor(hex).isValid()) {
          state.color.hex = hex;
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
        advancePanelShow,
        onBack,
        onCompactChange,
        onAlphaChange,
        onHueChange,
        onBoardChange,
        onLightChange,
        onInputChange,
        previewStyle,
        historyColors,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-fk-colorPicker {
    position: relative;
    box-sizing: border-box;
    border-radius: 3px;
    user-select: none;
    background-color: white;

    &__inner {
      position: relative;
    }

    &__header {
      margin-bottom: 12px;
      z-index: 999;
      text-align: left;

      .back {
        border: solid black;
        border-width: 0 1px 1px 0;
        display: inline-block;
        padding: 4px;
        margin-left: 2px;
        transform: rotate(135deg);
      }
    }

    &__display {
      position: relative;
      width: 100%;
      margin: 0;
      text-align: left;

      .transparent {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
        background-repeat: repeat;
      }

      .current-color {
        margin-right: 10px;
        width: 50px;
        height: 24px;
        box-shadow: 3px 0 5px #00000014;
        position: relative;
        cursor: pointer;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;

        .color-cube {
          width: 100%;
          height: 100%;
        }
      }

      .hexColor-prefix {
        position: relative;
        padding: 0 4px;
        font-size: 14px;
        display: inline-block;
        vertical-align: middle;
      }

      input {
        width: 25px;
        text-align: center;
        outline: 0;
        border-top: 0;
        border-right: 0;
        border-left: none;
        display: inline-block;
        vertical-align: middle;
        padding-bottom: 3px;
        border-bottom: 1px solid #e3e2e8;
      }

      .hexColor-input {
        width: 64px;
      }

      .action {
        float: right;
        vertical-align: middle;

        .clear-btn {
          border-color: transparent;
          color: #409eff;
          background: transparent;
          padding-left: 0;
          padding-right: 0;
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
        }

        .copy-btn {
          border-color: transparent;
          color: rgba(19, 206, 102, 0.8);
          background: transparent;
          padding-left: 0;
          padding-right: 0;
          display: inline-block;
          margin-left: 10px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
  }
</style>
