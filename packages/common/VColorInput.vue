<template>
  <div class="inputs-controls">
    <button class="formatBtn" @click="onChangeFormat">
      {{ currentFormat }}
    </button>
    <div class="format-group" v-if="currentFormat === 'hsv'">
      <input
        v-model="currentColor.hsv.h"
        type="number"
        min="0"
        max="360"
        placeholder="h"
        @blur="onInputChange('hsv')"
      />
      <input
        v-model="currentColor.hsv.s"
        type="number"
        min="0"
        max="1"
        placeholder="s"
        @blur="onInputChange('hsv')"
      />
      <input
        v-model="currentColor.hsv.v"
        type="number"
        min="0"
        max="1"
        placeholder="v"
        @blur="onInputChange('hsv')"
      />
    </div>
    <div class="format-group" v-if="currentFormat === 'hsl'">
      <input
        v-model="currentColor.hsl.h"
        type="number"
        min="0"
        max="360"
        placeholder="h"
        @blur="onInputChange('hsl')"
      />
      <input
        v-model="currentColor.hsl.s"
        type="number"
        min="0"
        max="1"
        placeholder="s"
        @blur="onInputChange('hsl')"
      />
      <input
        v-model="currentColor.hsl.l"
        type="number"
        min="0"
        max="1"
        placeholder="l"
        @blur="onInputChange('hsl')"
      />
    </div>
    <div class="format-group" v-if="currentFormat === 'rgb'">
      <input
        v-model="currentColor.rgb.r"
        type="number"
        min="0"
        max="255"
        placeholder="r"
        @blur="onInputChange('rgb')"
      />
      <input
        v-model="currentColor.rgb.g"
        type="number"
        min="0"
        max="255"
        placeholder="g"
        @blur="onInputChange('rgb')"
      />
      <input
        v-model="currentColor.rgb.b"
        type="number"
        min="0"
        max="255"
        @blur="onInputChange('rgb')"
        placeholder="b"
      />
    </div>
    <div class="format-group" v-if="currentFormat === 'hex'">
      <input
        v-model="currentColor.hex"
        type="text"
        maxlength="7"
        placeholder="hex"
        @blur="onInputChange('hex')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRaw, watch } from "vue";
import { Color, ColorAttrs, ColorInput } from "../color";
import { ArrayUtils } from "@aesoper/normal-utils";

const formatList = ["hex", "hsl", "rgb", "hsv"];

export default defineComponent({
  name: "VColorInput",
  props: {
    color: {
      type: [String, Object] as PropType<ColorInput>,
      default: "#000000"
    }
  },
  emits: ["update:color", "change"],
  setup(props, { emit }) {
    const colorClass = new Color();

    const currentFormat = ref(formatList[1]);
    const currentColor = ref<ColorAttrs>(colorClass.parseColor(props.color));

    const onChangeFormat = () => {
      const index = ArrayUtils.findIndex(
        formatList,
        (val: string) => val == currentFormat.value
      );

      currentFormat.value = formatList[(index + 1) % formatList.length];
    };

    watch(
      () => props.color,
      (newVal: ColorInput) => {
        currentColor.value = colorClass.parseColor(toRaw(newVal));
      }
    );

    const doOnChange = (data: any, oldHue?: number): void => {
      currentColor.value = colorClass.parseColor(data, oldHue);
      emit("update:color", currentColor.value);
      emit("change", currentColor.value);
    };

    const onInputChange = (source: string) => {
      switch (source) {
        case "hex":
          doOnChange({ hex: currentColor.value.hex, source: "hex" });
          break;
        case "hsl":
          doOnChange({ hsl: currentColor.value.hsl, source: "hsl" });
          break;
        case "rgb":
          doOnChange({ rgb: currentColor.value.rgb, source: "rgb" });
          break;
        case "hsv":
          doOnChange({ hsv: currentColor.value.hsv, source: "hsv" });
      }
    };

    return { currentFormat, currentColor, onChangeFormat, onInputChange };
  }
});
</script>

<style lang="scss" scoped>
.inputs-controls {
  display: flex;
  font-size: 16px;
  margin-bottom: 5px;

  .formatBtn {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 1px;
    border: 0;
    text-align: center;
    cursor: pointer;
    background-color: transparent;
    font-weight: 700;
    outline: none;
    margin-right: 5px;

    &:hover {
      color: #1a3aff;
    }
  }

  .format-group {
    display: flex;
    flex-grow: 1;

    input {
      padding: 5px;
      margin: 0 3px;
      min-width: 0;
      text-align: center;
      border-width: 0 0 1px 0;
      -webkit-appearance: none;
      appearance: none;
      -moz-appearance: textfield;
      outline: none;
      flex: 1;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
      }
    }
  }
}
</style>
