import { defineComponent, PropType } from "vue";
import tinycolor from "tinycolor2";

const defaultColors: string[][] = [
  // 第一行
  [
    "#fcc02e",
    "#f67c01",
    "#e64a19",
    "#d81b43",
    "#8e24aa",
    "#512da7",
    "#1f87e8",
    "#008781",
    "#05a045",
  ],
  // 第二行
  [
    "#fed835",
    "#fb8c00",
    "#f5511e",
    "#eb1d4e",
    "#9c28b1",
    "#5d35b0",
    "#2097f3",
    "#029688",
    "#4cb050",
  ],
  // 第三行
  [
    "#ffeb3c",
    "#ffa727",
    "#fe5722",
    "#eb4165",
    "#aa47bc",
    "#673bb7",
    "#42a5f6",
    "#26a59a",
    "#83c683",
  ],
  // 第四行
  [
    "#fff176",
    "#ffb74e",
    "#ff8a66",
    "#f1627e",
    "#b968c7",
    "#7986cc",
    "#64b5f6",
    "#80cbc4",
    "#a5d6a7",
  ],
  // 第五行
  [
    "#fff59c",
    "#ffcc80",
    "#ffab91",
    "#fb879e",
    "#cf93d9",
    "#9ea8db",
    "#90caf8",
    "#b2dfdc",
    "#c8e6ca",
  ],
  // 最后一行
  [
    "transparent",
    "#ffffff",
    "#dedede",
    "#a9a9a9",
    "#4b4b4b",
    "#353535",
    "#212121",
    "#000000",
    "advance",
  ],
];

export default defineComponent({
  name: "Compact",
  props: {
    palette: {
      type: Array as PropType<string[][]>,
      default: () => {
        return defaultColors;
      },
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    const computedBgStyle = (color: string) => {
      if (color === "transparent") {
        return color;
      }
      if (color === "advance") {
        return {};
      }
      return { background: tinycolor(color).toRgbString() };
    };

    const changeColor = (color: string) => {
      emit("change", color);
    };

    const renderCol = (colors: string[]) => {
      return colors.map((v) => {
        const cubeClass = [
          "bee-compact__color_cube",
          {
            advance: v === "advance",
            transparent: v === "transparent",
          },
        ];
        return (
          <div class="bee-compact__color-cube--wrap">
            <div class={cubeClass} style={computedBgStyle(v)} onClick={() => changeColor(v)} />
          </div>
        );
      });
    };

    const renderRow = () => {
      return props.palette?.map((value) => {
        return <div class="bee-compact__row">{renderCol(value)}</div>;
      });
    };

    return () => {
      return <div class="bee-compact">{renderRow()}</div>;
    };
  },
});
