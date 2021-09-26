import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "History",
  props: {
    colorList: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
    round: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    const onClickRecord = (color: string) => {
      emit("change", color);
    };

    return () => {
      return (
        <div class="bee-colorPicker__record">
          <div class="color-list">
            {props.colorList?.map((v) => {
              return (
                <div
                  class={["color-item", "transparent", { "color-item__round": props.round }]}
                  onClick={() => onClickRecord(v)}
                >
                  <div class="color-item__display" style={{ backgroundColor: v }} />
                </div>
              );
            })}
          </div>
        </div>
      );
    };
  },
});
