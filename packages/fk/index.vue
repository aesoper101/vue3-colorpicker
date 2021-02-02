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
        :saturation="currentColor.saturation"
        :hue="currentColor.hue"
        :value="currentColor.value"
        @change="onSaturationChange"
        v-if="advancePanelShow"
      />
      <light
        :light="currentColor.light"
        :saturation="currentColor.hslSaturation"
        :hue="currentColor.hue"
        @change="onLightChange"
        v-if="!advancePanelShow && !disableLight"
      />
      <hue
        :hue="currentColor.hue"
        @change="onHueChange"
        v-if="advancePanelShow && !disableHue"
      />
      <alpha
        :color="currentColor.color"
        @change="onAlphaChange"
        v-model:alpha="currentColor.alpha"
        v-if="!disableAlpha"
      />

      <div class="bee-fk-colorPicker__display">
        <div class="current-color transparent">
          <div
            class="color-cube"
            :style="{ background: currentColor.color }"
          ></div>
        </div>
        <span class="hexColor-prefix">#</span>
        <input
          class="hexColor-input"
          v-model="currentColorInput"
          @input="onInputChange"
        />
        <div class="action">
          <div class="copy-btn">复制</div>
        </div>
      </div>

      <history
        v-if="!disableHistory"
        :color-list="storageColorList"
        @change="onCompactChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from "vue";
import Hue from "../common/Hue.vue";
import { ColorPickerProps, useColorSetup } from "../color";
import Compact from "../common/Compact.vue";
import Saturation from "../common/Saturation.vue";
import Alpha from "../common/Alpha.vue";
import Light from "../common/Light.vue";
import History from "../common/History.vue";

export default defineComponent({
  name: "Fk",
  components: { History, Light, Alpha, Saturation, Compact, Hue },
  props: {
    color: {
      type: String,
      default: "#000000"
    },
    disableAlpha: Boolean,
    disableLight: Boolean,
    disableHue: Boolean,
    disableHistory: Boolean
  },
  setup(props: ColorPickerProps, ctx: SetupContext) {
    const apis = useColorSetup(props, ctx);
    return { ...apis };
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
