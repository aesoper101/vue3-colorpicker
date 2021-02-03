<template>
  <div class="bee-fk-colorPicker">
    <div class="bee-fk-colorPicker__inner">
      <div class="bee-fk-colorPicker__header" v-if="advancePanelShow">
        <span style="cursor: pointer;" @click="onBack">
          <div class="back"></div>
          <span>返回</span>
        </span>
      </div>
      <compact @change="onCompactChange" v-if="!advancePanelShow" />
      <saturation
        :saturation="currentColor.hsv.s"
        :hue="currentColor.hsv.h"
        :value="currentColor.hsv.v"
        @change="onSaturationChange"
        v-if="advancePanelShow"
      />
      <hue
        :hue="currentColor.hsv.h"
        @change="onHueChange"
        v-if="advancePanelShow && !disableHue"
      />
      <light
        :hue="currentColor.hsl.h"
        :light="currentColor.hsl.l * 100"
        :saturation="currentColor.hsl.s * 100"
        @change="onLightChange"
        v-if="!advancePanelShow && !disableLight"
      />
      <alpha
        :color="currentColor.hex8"
        @change="onAlphaChange"
        :alpha="currentColor.alpha"
        v-if="!disableAlpha"
      />

      <div class="bee-fk-colorPicker__display">
        <div class="current-color transparent">
          <div
            class="color-cube"
            :style="{ background: currentColor.hex8 }"
          ></div>
        </div>
        <span class="hexColor-prefix">#</span>
        <input
          class="hexColor-input"
          ref="colorInput"
          :value="currentColor.hex.replace('#', '')"
          @blur="onInputChange"
        />
        <div class="action">
          <div class="copy-btn">复制</div>
        </div>
      </div>

      <history
        :color-list="storageColorList"
        @change="onCompactChange"
        v-if="!disableHistory && storageColorList.length > 0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, toRaw, onMounted } from "vue";
import Hue from "../common/Hue.vue";
import Compact from "../common/Compact.vue";
import Saturation from "../common/Saturation.vue";
import Alpha from "../common/Alpha.vue";
import Light from "../common/Light.vue";
import History from "../common/History.vue";
import { Color, ColorInput, parseColor } from "../color";
import { useStorage } from "vue3-storage";
import debounce from "lodash.debounce";

const debounceFn = debounce(
  (fn: Function) => {
    fn();
  },
  200,
  {
    leading: true,
    trailing: false
  }
);

export default defineComponent({
  name: "TestPicker",
  components: { Compact, Light, Alpha, Saturation, Hue, History },
  props: {
    color: {
      type: [String, Object] as PropType<ColorInput>,
      default: "#000000"
    },
    format: {
      type: String,
      default: "hex8"
    },
    disableAlpha: Boolean,
    disableLight: Boolean,
    disableHue: Boolean,
    disableHistory: Boolean
  },
  emits: ["update:color", "change"],
  setup(props, { emit }) {
    const currentColor = ref<Color>(parseColor(props.color));
    const _oldHue = ref(currentColor.value.oldHue);
    const advancePanelShow = ref(false);

    const storage = useStorage();
    const storageColorList = ref<string[]>([]);

    const colorInput = ref<HTMLInputElement | null>(null);

    const onBack = () => {
      advancePanelShow.value = false;
    };

    const onStorageColor = () => {
      storageColorList.value = storageColorList.value.filter(value => {
        return value !== currentColor.value.hex8;
      });
      if (storageColorList.value.length >= 6) {
        storageColorList.value.shift();
      }
      storageColorList.value.push(currentColor.value.hex8);
      storage?.setStorage({
        key: "colorList",
        data: storageColorList.value
      });
    };

    const onInitColorList = () => {
      storageColorList.value =
        storage?.getStorageSync<string[]>("colorList") || [];
    };

    const doOnChange = (data: any, oldHue?: number): void => {
      currentColor.value = parseColor(data, oldHue);
      debounceFn(onStorageColor);
    };

    const doUpdate = () => {
      emit("update:color", currentColor.value.hex8);
      emit("change", currentColor.value);
    };

    const onCompactChange = (color: string) => {
      if (color === "advance") {
        advancePanelShow.value = true;
      } else {
        _oldHue.value = currentColor.value.hsl.h;
        doOnChange(color);
        doUpdate();
      }
    };

    const onLightChange = (light: number) => {
      doOnChange(
        {
          h: currentColor.value.hsl.h,
          s: currentColor.value.hsl.s,
          l: light / 100,
          a: currentColor.value.hsl.a,
          source: "light"
        },
        currentColor.value.hsl.h
      );
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

    const onInputChange = (event: FocusEvent) => {
      const target = event.target as HTMLInputElement;
      const hex = target.value;
      doOnChange({ hex: hex });
      doUpdate();
    };

    watch(
      () => props.color,
      (newVal: ColorInput) => {
        doOnChange(toRaw(newVal));
      }
    );

    onMounted(() => {
      onInitColorList();
    });

    return {
      colorInput,
      currentColor,
      storageColorList,
      onBack,
      advancePanelShow,
      onCompactChange,
      onLightChange,
      onAlphaChange,
      onSaturationChange,
      onHueChange,
      onInputChange
    };
  }
});
</script>

<style lang="scss" scoped>
.bee-fk-colorPicker {
  position: relative;
  box-sizing: border-box;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: white;
  width: 249px;
  padding-bottom: 10px;

  &__inner {
    padding: 12px;
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
      -webkit-transform: rotate(135deg);
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
