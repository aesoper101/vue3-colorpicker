<template>
  <div class="vc-colorpicker">
    <div class="vc-colorpicker--container">
      <div class="vc-colorpicker--tabs" v-if="showTab">
        <div class="vc-colorpicker--tabs__inner">
          <div
            :class="[
              'vc-colorpicker--tabs__btn',
              {
                'vc-btn-active': state.activeKey === 'single',
              },
            ]"
            @click="onActiveKeyChange('single')"
          >
            <button>
              <div class="vc-btn__content">纯色</div>
            </button>
          </div>
          <div
            :class="[
              'vc-colorpicker--tabs__btn',
              {
                'vc-btn-active': state.activeKey === 'gradient',
              },
            ]"
            @click="onActiveKeyChange('gradient')"
          >
            <button>
              <div class="vc-btn__content">渐变色</div>
            </button>
          </div>
          <div
            class="vc-colorpicker--tabs__bg"
            :style="{
              width: `50%`,
              left: `calc(${state.activeKey === 'gradient' ? 50 : 0}%)`,
            }"
          ></div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive } from "vue";
  import propTypes from "vue-types";
  import { whenever } from "@vueuse/core";

  export default defineComponent({
    name: "WrapContainer",
    props: {
      showTab: propTypes.bool.def(false),
      activeKey: propTypes.oneOf(["single", "gradient"]).def("single"),
    },
    emits: ["update:activeKey", "change"],
    setup(props, { emit }) {
      const state = reactive({
        activeKey: props.activeKey,
      });

      const onActiveKeyChange = (key: string) => {
        state.activeKey = key;
        emit("update:activeKey", key);
        emit("change", key);
      };

      whenever(
        () => props.activeKey,
        (value) => {
          state.activeKey = value;
        }
      );

      return { state, onActiveKeyChange };
    },
  });
</script>

<style lang="scss" scoped>
  .vc-colorpicker {
    position: relative;
    box-sizing: border-box;
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    user-select: none;
    background-color: white;
    width: 276px;
    padding-bottom: 10px;
    z-index: 10000;

    * {
      outline: none;
      line-height: 1;
    }

    &--container {
      padding: 16px;
    }

    &--tabs {
      padding: 2px;
      background: #f6f7f9;
      border-radius: 6px;
      position: relative;
      margin-bottom: 12px;

      &__inner {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: justify;
        justify-content: space-between;
        padding: 0;
        background: #f6f7f9;
        border-bottom: none;
        position: relative;
        box-sizing: border-box;
      }

      &__btn {
        -ms-flex: 1;
        flex: 1;
        z-index: 2;
        color: #636c78;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;

        &.vc-btn-active {
          color: #33383e;
          font-weight: 600;
        }

        button {
          width: 100%;
          background-color: initial;
          padding: 6px 0;
          font-size: 14px;
          line-height: 20px;
          color: #636c78;
          border: 0;
          border-radius: 0;
          outline: 0;
          cursor: pointer;
          -webkit-appearance: none;
          font-weight: inherit;

          .vc-btn__content {
            position: relative;
            white-space: nowrap;
          }
        }
      }

      &__bg {
        position: absolute;
        top: 0;
        bottom: 0;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        z-index: 1;
        transition: left 0.2s ease-in-out;
      }
    }
  }
</style>
