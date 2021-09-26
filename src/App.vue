<script setup lang="ts">
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
  import ChromeColorPicker from "../packages/chrome";
  import { ref } from "vue";
  import { ColorInput } from "../packages/color";
  import FkColorPicker from "../packages/fk";
  import EleColorPicker from "../packages/ele";
  import PopuColorPicker from "../packages/popup";

  const color = ref<ColorInput>("red");
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div style="display: flex">
    <ChromeColorPicker v-model:color="color" />
    <div style="margin-left: 50px"></div>
    <FkColorPicker v-model:color="color" />
    <div style="margin-left: 50px"></div>
    <EleColorPicker v-model:color="color" />
    <div style="margin-left: 50px"></div>
    <PopuColorPicker v-model:color="color" />
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
