<template>
  <div class="bee-chrome-colorPicker">
    <saturation
      :saturation="currentColor.hsv.s"
      :hue="currentColor.hsv.h"
      :value="currentColor.hsv.v"
      @change="onSaturationChange"
      :round="true"
      :hidden="true"
    />
    <div class="bee-chrome-colorPicker-body">
      <div class="chrome-controls">
        <div class="chrome-color-wrap transparent">
          <div
            class="current-color"
            :style="{ background: currentColor.hex8 }"
          ></div>
        </div>
        <div class="chrome-sliders">
          <hue
            :hue="currentColor.hsv.h"
            @change="onHueChange"
            size="small"
            v-if="!disableHue"
          />
          <alpha
            size="small"
            :color="currentColor.hex8"
            @change="onAlphaChange"
            :alpha="currentColor.alpha"
            v-if="!disableAlpha"
          />
        </div>
      </div>

      <v-color-input :color="currentColor" @change="onInputChange" />
      <history
        :color-list="storageColorList"
        :round="historyRound"
        @change="onCompactChange"
        v-if="!disableHistory"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, toRaw, watch } from "vue";
import Alpha from "../common/Alpha.vue";
import Saturation from "../common/Saturation.vue";
import Hue from "../common/Hue.vue";
import History from "../common/History.vue";
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
import VColorInput from "../common/VColorInput.vue";

export default defineComponent({
  name: "ChromeColorPicker",
  components: { VColorInput, History, Alpha, Saturation, Hue },
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
    disableClipboard: Boolean,
    historyRound: Boolean
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
.transparent {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
  background-repeat: repeat;
}
.bee-chrome-colorPicker {
  position: relative;
  box-sizing: border-box;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: white;
  width: 250px;
  padding-bottom: 20px;

  &-body {
    padding: 0 12px;
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
