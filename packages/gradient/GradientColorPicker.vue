<template>
  <div class="vc-gradient-picker">
    <div class="vc-gradient-picker__header" v-show="advancePanelShow">
      <span style="cursor: pointer" @click="onBack">
        <div class="back"></div>
      </span>
    </div>
    <div class="vc-gradient-picker__body">
      <div class="vc-color-range" ref="colorRangeRef">
        <div class="vc-color-range__container">
          <div class="vc-background" :style="gradientBg"></div>
          <div class="vc-gradient__stop__container">
            <div
              class="vc-gradient__stop"
              :class="{
                'vc-gradient__stop--current': state.startActive,
              }"
              ref="startGradientRef"
              :title="lang === 'ZH-cn' ? '开始' : 'Start'"
              :style="{ left: getStartColorLeft + 'px' }"
            >
              <span class="vc-gradient__stop--inner"></span>
            </div>
            <div
              class="vc-gradient__stop"
              :class="{
                'vc-gradient__stop--current': !state.startActive,
              }"
              ref="stopGradientRef"
              :title="lang === 'ZH-cn' ? '结束' : 'End'"
              :style="{ left: getEndColorLeft + 'px' }"
            >
              <span class="vc-gradient__stop--inner"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="vc-picker-degree-input vc-degree-input">
        <div class="vc-degree-input__control">
          <input :value="state.angle" @blur="onDegreeBlur" />deg
        </div>
        <div class="vc-degree-input__panel">
          <div class="vc-degree-input__disk">
            <Angle v-model:angle="state.angle" :size="40" @change="onDegreeChange" />
          </div>
        </div>
      </div>
    </div>
    <Palette v-if="!advancePanelShow" @change="onCompactChange" />
    <Board :color="currentColor" v-if="advancePanelShow" @change="onBoardChange" />
    <Hue v-if="advancePanelShow" :color="currentColor" @change="onHueChange" />
    <Lightness v-if="!advancePanelShow" :color="currentColor" @change="onLightChange" />
    <Alpha :color="currentColor" @change="onAlphaChange" v-if="!disableAlpha" />
    <Display :color="currentColor" :disable-alpha="disableAlpha" @change="onDisplayChange" />
    <History
      :round="roundHistory"
      :colors="historyColors"
      v-if="!disableHistory"
      @change="onCompactChange"
    />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, inject, reactive, ref, watch } from "vue";
  import propTypes from "vue-types";
  import { tryOnMounted, useDebounceFn, useLocalStorage, whenever } from "@vueuse/core";
  import { DOMUtils } from "@aesoper/normal-utils";
  import tinycolor from "tinycolor2";

  import Alpha from "../common/Alpha.vue";
  import Palette from "../common/Palette.vue";
  import Board from "../common/Board.vue";
  import Hue from "../common/Hue.vue";
  import Lightness from "../common/Lightness.vue";
  import History from "../common/History.vue";
  import Display from "../common/Display.vue";
  import { Color, HistoryColorKey, MAX_STORAGE_LENGTH } from "../utils/color";
  import { ColorPickerProvider, ColorPickerProviderKey } from "../utils/type";
  import Angle from "../angle/Angle";

  export default defineComponent({
    name: "GradientColorPicker",
    components: { Angle, Display, Alpha, Palette, Board, Hue, Lightness, History },
    props: {
      startColor: propTypes.instanceOf(Color).isRequired,
      endColor: propTypes.instanceOf(Color).isRequired,
      startColorStop: propTypes.number.def(0),
      endColorStop: propTypes.number.def(100),
      angle: propTypes.number.def(0),
      disableHistory: propTypes.bool.def(false),
      roundHistory: propTypes.bool.def(false),
      disableAlpha: propTypes.bool.def(false),
    },
    emits: [
      "update:startColor",
      "update:endColor",
      "update:angle",
      "update:startColorStop",
      "update:endColorStop",
      "startColorChange",
      "endColorChange",
      "advanceChange",
      "angleChange",
      "startColorStopChange",
      "endColorStopChange",
    ],
    setup(props, { emit }) {
      const state = reactive({
        startActive: true,
        startColor: props.startColor,
        endColor: props.endColor,
        startColorStop: props.startColorStop,
        endColorStop: props.endColorStop,
        angle: props.angle,

        // rgba
        startColorRgba: props.startColor.toRgbString(),
        endColorRgba: props.endColor.toRgbString(),
      });

      const parent = inject<ColorPickerProvider>(ColorPickerProviderKey);

      const advancePanelShow = ref(false);

      // Ref
      const startGradientRef = ref<HTMLElement>();
      const stopGradientRef = ref<HTMLElement>();
      const colorRangeRef = ref<HTMLElement>();

      watch(
        () => [props.startColor, props.endColor, props.angle],
        (val: any[]) => {
          state.startColor = val[0];
          state.endColor = val[1];
          state.angle = val[2];
        }
      );

      const currentColor = computed({
        get: () => {
          return state.startActive ? state.startColor : state.endColor;
        },
        set: (v) => {
          if (state.startActive) {
            state.startColor = v;
            return;
          }
          state.endColor = v;
        },
      });

      const getStartColorLeft = computed(() => {
        if (colorRangeRef.value && startGradientRef.value) {
          const alpha = state.startColorStop / 100;
          const rect = colorRangeRef.value.getBoundingClientRect();
          const offsetWidth = startGradientRef.value.offsetWidth;

          return Math.round(alpha * (rect.width - offsetWidth) + offsetWidth / 2);
        }

        return 0;
      });

      const getEndColorLeft = computed(() => {
        if (colorRangeRef.value && stopGradientRef.value) {
          const alpha = state.endColorStop / 100;
          const rect = colorRangeRef.value.getBoundingClientRect();
          const offsetWidth = stopGradientRef.value.offsetWidth;

          return Math.round(alpha * (rect.width - offsetWidth) + offsetWidth / 2);
        }

        return 0;
      });

      const gradientBg = computed(() => {
        return {
          background: `linear-gradient(${state.angle}deg, ${state.startColorRgba} ${state.startColorStop}%, ${state.endColorRgba} ${state.endColorStop}%)`,
        };
      });

      const dragStartRange = (evt: MouseEvent) => {
        state.startActive = true;
        if (colorRangeRef.value && startGradientRef.value) {
          const rect = colorRangeRef.value?.getBoundingClientRect();

          let left = evt.clientX - rect.left;
          left = Math.max(startGradientRef.value.offsetWidth / 2, left);
          left = Math.min(left, rect.width - startGradientRef.value.offsetWidth / 2);

          state.startColorStop = Math.round(
            ((left - startGradientRef.value.offsetWidth / 2) /
              (rect.width - startGradientRef.value.offsetWidth)) *
              100
          );

          emit("update:startColorStop", state.startColorStop);
          emit("startColorStopChange", state.startColorStop);
        }
      };

      const dragEndRange = (evt: MouseEvent) => {
        state.startActive = false;

        if (colorRangeRef.value && stopGradientRef.value) {
          const rect = colorRangeRef.value?.getBoundingClientRect();

          let left = evt.clientX - rect.left;
          left = Math.max(stopGradientRef.value.offsetWidth / 2, left);
          left = Math.min(left, rect.width - stopGradientRef.value.offsetWidth / 2);

          state.endColorStop = Math.round(
            ((left - stopGradientRef.value.offsetWidth / 2) /
              (rect.width - stopGradientRef.value.offsetWidth)) *
              100
          );

          emit("update:endColorStop", state.endColorStop);
          emit("endColorStopChange", state.endColorStop);
        }
      };

      const onDegreeBlur = (evt: FocusEvent) => {
        const target = evt.target as HTMLInputElement;
        const degree = parseInt(target.value.replace("°", ""));
        if (!isNaN(degree)) {
          state.angle = degree % 360;
        }
        emit("update:angle", state.angle);
        emit("angleChange", state.angle);
      };

      const onDegreeChange = (angle: number) => {
        state.angle = angle;
        emit("update:angle", state.angle);
        emit("angleChange", state.angle);
      };

      const onCompactChange = (color: string) => {
        if (color === "advance") {
          advancePanelShow.value = true;
          emit("advanceChange", true);
        } else {
          currentColor.value.hex = color;
          emit("advanceChange", false);
        }
        doColorChange();
      };

      const onAlphaChange = (alpha: number) => {
        currentColor.value.alpha = alpha;
        doColorChange();
      };

      const onHueChange = (hue: number) => {
        currentColor.value.hue = hue;
        doColorChange();
      };

      const onBoardChange = (saturation: number, brightness: number) => {
        currentColor.value.saturation = saturation;
        currentColor.value.brightness = brightness;
        doColorChange();
      };

      const onLightChange = (light: number) => {
        currentColor.value.lightness = light;
        doColorChange();
      };

      const onDisplayChange = () => {
        doColorChange();
      };

      const doColorChange = () => {
        if (state.startActive) {
          emit("update:startColor", state.startColor);
          emit("startColorChange", state.startColor);
        } else {
          emit("update:endColor", state.endColor);
          emit("endColorChange", state.endColor);
        }
      };

      const onBack = () => {
        advancePanelShow.value = false;
        emit("advanceChange", false);
      };

      const historyColors = useLocalStorage<string[]>(HistoryColorKey, [], {});

      const updateColorHistoryFn = useDebounceFn(() => {
        if (props.disableHistory) {
          return;
        }
        const rgbString = currentColor.value.toRgbString();

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

      tryOnMounted(() => {
        if (stopGradientRef.value && startGradientRef.value) {
          DOMUtils.triggerDragEvent(stopGradientRef.value, {
            drag: (event: Event) => {
              dragEndRange(event as MouseEvent);
            },
            end: (event: Event) => {
              dragEndRange(event as MouseEvent);
            },
          });
          DOMUtils.triggerDragEvent(startGradientRef.value, {
            drag: (event: Event) => {
              dragStartRange(event as MouseEvent);
            },
            end: (event: Event) => {
              dragStartRange(event as MouseEvent);
            },
          });
        }
      });

      whenever(
        () => state.startColor,
        (value) => {
          state.startColorRgba = value.toRgbString();
        },
        { deep: true }
      );

      whenever(
        () => state.endColor,
        (value) => {
          state.endColorRgba = value.toRgbString();
        },
        { deep: true }
      );

      whenever(
        () => currentColor.value,
        () => {
          updateColorHistoryFn();
        },
        { deep: true }
      );

      return {
        startGradientRef,
        stopGradientRef,
        colorRangeRef,
        state,
        currentColor,
        getStartColorLeft,
        getEndColorLeft,
        gradientBg,
        advancePanelShow,
        onDegreeBlur,
        onCompactChange,
        onAlphaChange,
        onHueChange,
        onBoardChange,
        onLightChange,
        historyColors,
        onBack,
        onDegreeChange,
        onDisplayChange,
        lang: parent?.lang,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-gradient-picker {
    position: relative;

    &__header {
      margin-bottom: 20px;
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

    &__body {
      margin-bottom: 12px;
      display: -ms-flexbox;
      display: flex;
      align-items: center;

      .vc-color-range {
        flex: 1;

        &__container {
          position: relative;
          height: 16px;
          border-radius: 5px;

          .vc-background {
            height: 100%;
            border-radius: 4px;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
          }

          .vc-gradient__stop__container {
            position: absolute;
            //width: calc(100% - 14px);
            width: 100%;
            top: 0;
            height: 100%;
            left: 0;
            //left: 7px;

            .vc-gradient__stop {
              position: absolute;
              top: -2px;
              width: 14px;
              height: 16px;
              overflow: hidden;
              border: 2px solid #fff;
              border-radius: 2px;
              cursor: pointer;
              box-shadow: 0 0 2px rgba(0, 0, 0, 0.35);
              box-sizing: content-box;
              transform: translate(-9px, 0);

              &--inner {
                display: inline-block;
                height: 100%;
              }

              &--current {
                position: relative;
                z-index: 1;
                box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2), 0 0 0 1.2px #2254f4;
              }
            }
          }
        }
      }

      .vc-degree-input {
        position: relative;
        z-index: 2;
        font-size: 12px;
        background-color: #f6f7f9;
        border-radius: 4px;

        &:hover {
          .vc-degree-input__panel {
            display: block;
          }
        }

        &__control {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          background-color: inherit;

          input {
            max-width: 28px;
            text-align: center;
            border: none;
            outline: none;
            background-color: initial;
            color: #33383e;
            font-size: inherit;
            overflow: visible;
          }
        }

        &__panel {
          display: none;
          padding-top: 4px;
          z-index: 10;

          .vc-degree-input__disk {
            width: 64px;
            height: 64px;
            background-color: #fff;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 1px 8px rgba(0, 0, 0, 0.06),
              0 4px 12px rgba(0, 0, 0, 0.08);
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            transform: translate(0, 0);
          }
        }
      }

      .vc-picker-degree-input {
        margin-left: 8px;
        width: 64px;
        height: 28px;
      }
    }
  }
</style>
