<template>
  <div class="bee-ele-colorPicker">
    <div class="bee-ele-row">
      <saturation
        class="bee-ele-saturation"
        :hidden="true"
        :saturation="currentColor.hsv.s"
        :hue="currentColor.hsv.h"
        :value="currentColor.hsv.v"
        @change="onSaturationChange"
      />
      <hue
        class="bee-ele-hue"
        :vertical="true"
        size="small"
        :hue="currentColor.hsv.h"
        @change="onHueChange"
        v-if="!disableHue"
      />
    </div>
    <alpha
      style="width: 257px"
      :color="currentColor.hex8"
      @change="onAlphaChange"
      :alpha="currentColor.alpha"
      v-if="!disableAlpha"
    />

    <v-color-input
      style="width: 257px"
      :color="currentColor"
      @change="onInputChange"
    />

    <history
      :color-list="storageColorList"
      :round="historyRound"
      @change="onCompactChange"
      v-if="!disableHistory"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, toRaw, watch } from "vue";
import Saturation from "../common/Saturation.vue";
import Hue from "../common/Hue.vue";
import Alpha from "../common/Alpha.vue";
import History from "../common/History.vue";
import VColorInput from "../common/VColorInput.vue";
import {
  Color,
  ColorAttrs,
  ColorFormat,
  ColorInput,
  debounceFn,
  MAX_STORAGE_LENGTH,
  STORAGE_COLOR_KEY
} from "../color";
import { useStorage } from "vue3-storage";

export default defineComponent({
  name: "EleColorPicker",
  components: { VColorInput, History, Alpha, Hue, Saturation },
  props: {
    color: {
      type: [String, Object] as PropType<ColorInput>,
      default: "#000000"
    },
    format: {
      type: String as PropType<ColorFormat>
    },
    disableAlpha: Boolean,
    disableLight: Boolean,
    disableHue: Boolean,
    disableHistory: Boolean,
    historyRound: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:color", "change"],
  setup(props, { emit }) {
    const colorClass = new Color();

    const currentColor = ref<ColorAttrs>(colorClass.parseColor(props.color));

    const storage = useStorage();
    const storageColorList = ref<string[]>([]);

    const onStorageColor = () => {
      storageColorList.value = storageColorList.value.filter(value => {
        return value !== currentColor.value.hex8;
      });
      if (storageColorList.value.length >= MAX_STORAGE_LENGTH) {
        storageColorList.value.shift();
      }
      storageColorList.value.push(currentColor.value.hex8);
      storage?.setStorage({
        key: STORAGE_COLOR_KEY,
        data: storageColorList.value
      });
    };

    const onInitColorList = () => {
      storageColorList.value =
        storage?.getStorageSync<string[]>(STORAGE_COLOR_KEY) || [];
    };

    const doOnChange = (data: any, oldHue?: number): void => {
      currentColor.value = colorClass.parseColor(data, oldHue);
      debounceFn(onStorageColor);
    };

    const doUpdate = () => {
      if (props.format) {
        emit("update:color", colorClass.format(props.format));
        emit("change", colorClass.format(props.format));
      } else {
        emit("update:color", currentColor.value);
        emit("change", currentColor.value);
      }
    };

    const onCompactChange = (color: string) => {
      doOnChange(color);
      doUpdate();
    };

    const onAlphaChange = (alpha: number) => {
      doOnChange(
        {
          h: currentColor.value.hsl.h,
          s: currentColor.value.hsl.s,
          l: currentColor.value.hsl.l,
          a: alpha,
          source: "alpha"
        },
        currentColor.value.hsl.h
      );
      doUpdate();
    };

    const onSaturationChange = (saturation: number, bright: number) => {
      doOnChange(
        {
          h: currentColor.value.hsv.h,
          s: saturation,
          v: bright,
          a: currentColor.value.hsv.a,
          source: "saturation"
        },
        currentColor.value.hsv.h
      );
      doUpdate();
    };

    const onHueChange = (hue: number) => {
      const { s: saturation, v: bright, a: alpha } = currentColor.value.hsv;
      doOnChange(
        {
          h: hue,
          s: saturation,
          v: bright,
          a: alpha,
          source: "hue"
        },
        hue
      );

      doUpdate();
    };

    const onInputChange = (val: ColorAttrs) => {
      currentColor.value = val;
      doUpdate();
    };

    watch(
      () => props.color,
      (newVal: ColorInput) => {
        doOnChange(toRaw(newVal));
        onInitColorList();
      }
    );

    onMounted(() => {
      onInitColorList();
    });

    return {
      storageColorList,
      currentColor,
      onAlphaChange,
      onHueChange,
      onSaturationChange,
      onInputChange,
      onCompactChange
    };
  }
});
</script>

<style lang="scss" scoped>
.bee-ele-colorPicker {
  position: relative;
  box-sizing: border-box;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: white;
  padding: 10px;
  width: 300px;

  .bee-ele-row {
    display: flex;

    .bee-ele-saturation {
      width: 280px;
      height: 180px;
    }

    .bee-ele-hue {
      margin-left: 10px;
      height: 180px;
    }
  }
}
</style>
