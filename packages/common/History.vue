<template>
  <div class="vc-colorPicker__record" v-if="colors && colors.length > 0">
    <div class="color-list">
      <template v-for="(v, i) in colors" :key="i">
        <div
          :class="['color-item', 'transparent', { 'color-item__round': round }]"
          @click="onColorSelect(v)"
        >
          <div class="color-item__display" :style="{ backgroundColor: v }"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import propTypes from "vue-types";

  export default defineComponent({
    name: "History",
    props: {
      colors: propTypes.arrayOf(String).def(() => []),
      round: propTypes.bool.def(false),
    },
    emits: ["change"],
    setup(_props, { emit }) {
      const onColorSelect = (v: string) => {
        emit("change", v);
      };
      return { onColorSelect };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-colorPicker__record {
    display: flex;
    align-items: center;
    margin-top: 15px;

    .text {
      width: 48px;
      margin-right: 10px;
      text-align: right;
      font-size: 12px;
      color: #666;
    }

    .color-list {
      width: auto;
      display: flex;
      position: relative;
      margin: 0;

      .color-item {
        position: relative;
        width: 26px;
        height: 26px;
        cursor: pointer;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
        margin-right: 1px;
        box-shadow: 3px 0 5px rgba(0, 0, 0, 0.08);

        &__round {
          border-radius: 50%;
        }

        &.transparent {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
          background-repeat: repeat;
        }

        &:hover {
          transform: scale(1.2);
          z-index: 299;
          transition: transform 0.2s;
        }

        &__display {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
