<template>
  <div>
    <canvas ref="wheelCanvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "WheelSaturation",
  props: {
    diameter: {
      type: Number,
      default: 150
    },
    hue: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 360;
      }
    },
    saturation: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 1;
      }
    },
    value: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 1;
      }
    }
  },
  setup(props) {
    const wheelCanvas = ref<HTMLCanvasElement | null>(null);

    const onDrawWheel = () => {
      if (wheelCanvas.value) {
        wheelCanvas.value.height = props.diameter;
        wheelCanvas.value.width = props.diameter;
        const ctx = wheelCanvas.value.getContext("2d");

        if (ctx) {
          const x = props.diameter / 2;
          const y = props.diameter / 2;
          const radius = props.diameter / 2;

          ctx.clearRect(0, 0, props.diameter, props.diameter);

          for (let angle = 0; angle < 360; angle += 1) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            const startAngle = ((angle - 2) * Math.PI) / 180;
            const endAngle = ((angle + 2) * Math.PI) / 180;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, startAngle, endAngle);
            ctx.closePath();

            gradient.addColorStop(0, `hsl(${props.hue}, 0%, 100%)`);
            gradient.addColorStop(0.5, `hsl(${props.hue}, 50%, 50%)`);
            gradient.addColorStop(1, `hsl(${props.hue}, 100%, 0%)`);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        }
      }
    };

    onMounted(() => {
      onDrawWheel();
    });

    return { wheelCanvas };
  }
});
</script>

<style scoped></style>
