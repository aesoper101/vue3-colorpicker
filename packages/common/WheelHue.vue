<template>
  <div>
    <canvas ref="wheelCanvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "WheelHue",
  props: {
    diameter: {
      type: Number,
      default: 200
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

          // 画出整个大圆
          for (let angle = 0; angle < 360; angle += 1) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            const startAngle = ((angle - 1 - 90) * Math.PI) / 180;
            const endAngle = ((angle + 1 - 90) * Math.PI) / 180;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, startAngle, endAngle);
            ctx.closePath();

            gradient.addColorStop(0, `hsl(${angle}, 100%, 50%)`);
            gradient.addColorStop(0.5, `hsl(${angle}, 100%, 50%)`);
            gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
            ctx.fillStyle = gradient;
            ctx.fill();
          }

          // 画内圆
          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.75, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // const width = radius / 2;
          // const height = radius / 2;
          // ctx.clearRect(x, y, width, height);
          //
          // const hue = 0;
          //
          // ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          // ctx.fillRect(x, y, width, height);
          //
          // const grdBlack = ctx.createLinearGradient(0, 0, width, 0);
          // grdBlack.addColorStop(0, `hsl(0, 0%, 50%)`);
          // grdBlack.addColorStop(1, `hsla(0, 0%, 50%, 0)`);
          // ctx.fillStyle = grdBlack;
          // ctx.fillRect(x, y, width, height);
          //
          // const grdWhite = ctx.createLinearGradient(0, 0, 0, height);
          // grdWhite.addColorStop(0, `hsl(0, 0%, 100%)`);
          // grdWhite.addColorStop(0.5, `hsla(0, 0%, 100%, 0)`);
          // grdWhite.addColorStop(0.5, `hsla(0, 0%, 0%, 0)`);
          // grdWhite.addColorStop(1, `hsl(0, 0%, 0%) `);
          // ctx.fillStyle = grdWhite;
          // ctx.fillRect(0, 0, width, height);
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
