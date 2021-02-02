<template>
  <div class="bee-chrome-colorPicker">
    <saturation
      :is-chrome="true"
      :saturation="currentColor.saturation"
      :hue="currentColor.hue"
      :value="currentColor.value"
      @change="onSaturationChange"
    />
    <div class="bee-chrome-colorPicker-body">
      <div class="chrome-controls">
        <div class="chrome-color-wrap transparent">
          <div
            class="current-color"
            :style="{ background: currentColor.color }"
          ></div>
        </div>
        <div class="chrome-sliders">
          <hue
            size="small"
            :hue="currentColor.hue"
            @change="onHueChange"
            v-if="!disableHue"
          />
          <alpha
            size="small"
            :color="currentColor.color"
            @change="onAlphaChange"
            v-model:alpha="currentColor.alpha"
            v-if="!disableAlpha"
          />
        </div>
      </div>
      <history
        v-if="!disableHistory"
        style="margin-top: 0"
        :color-list="storageColorList"
        @change="onCompactChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from "vue";
import Saturation from "../common/Saturation.vue";
import { ColorPickerProps, useColorSetup } from "../color";
import Hue from "../common/Hue.vue";
import Alpha from "../common/Alpha.vue";
import History from "../common/History.vue";

export default defineComponent({
  name: "Chrome",
  components: { History, Alpha, Hue, Saturation },
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
    const colorType = ref(0);

    return { ...apis, colorType };
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
