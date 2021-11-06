<script setup lang="ts">
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
  import { ref } from "vue";
  import tinycolor, { ColorInput } from "tinycolor2";
  import { ColorPicker } from "../packages";

  const color = ref<ColorInput>("red");

  console.log(tinycolor("431893").toRgbString(), tinycolor("431893").toRgbString());

  setTimeout(() => (color.value = "431893"), 100);
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  {{ color }}
  <div>
    <div style="display: inline-block">
      <ColorPicker v-model:color="color" format="rgb" id="a1" />
    </div>
    <div style="display: inline-block; margin-left: 30px">
      <ColorPicker v-model:color="color" format="rgb" id="a2" />
    </div>
  </div>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
