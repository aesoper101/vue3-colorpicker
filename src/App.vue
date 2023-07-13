<template>
  <div :style="bg" class="bg">{{ color }}</div>

  <div :style="bgline" class="bg"> {{ gradientColor }} </div>

  <div class="main">
    <div class="color-pickers">
      <ColorPicker v-model:pureColor="color" picker-container="#app" />
      <ColorPicker v-model:pureColor="color" shape="circle" pickerType="chrome" />
      <ColorPicker v-model:gradientColor="gradientColor" useType="gradient" />

      <div style="position: fixed; bottom: 10px; right: 10px">
        <ColorPicker v-model:gradientColor="gradientColor" useType="gradient" />
      </div>
    </div>

    <div class="color-pickers">
      <div>
        <ColorPicker v-model:pureColor="color" is-widget />
        <div>pickerType: fk</div>
      </div>
      <div>
        <ColorPicker v-model:pureColor="color" is-widget pickerType="chrome" :debounce="10" />
        <div>pickerType: chrome</div>
      </div>

      <div>
        <ColorPicker
          v-model:pureColor="color"
          v-model:gradientColor="gradientColor"
          is-widget
          activeKey="gradient"
          useType="both"
          :debounce="10"
          @gradientColorChange="onChange"
          @pureColorChange="onChange"
        />
        <div> <div>useType: both</div></div>
      </div>

      <div>
        <ColorPicker
          pickerType="chrome"
          useType="gradient"
          v-model:gradientColor="gradientColor"
          :disableHistory="true"
          is-widget
        />
        <div> <div>useType: gradient</div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";

  const color = ref("blue");
  const gradientColor = ref(
    "linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 1) 100%)"
  );

  const bg = computed(() => {
    return { background: color.value };
  });
  const bgline = computed(() => {
    return { background: gradientColor.value };
  });

  const onChange = (val: string) => {
    console.log(val);
  };
</script>

<style>
  body,
  html {
    margin: 0;
    padding: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
  }

  .main {
    padding: 40px 10%;
  }

  .color-pickers {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }

  .bg {
    color: #fff;
    font-size: 24px;
    padding: 40px 0;
  }
</style>
