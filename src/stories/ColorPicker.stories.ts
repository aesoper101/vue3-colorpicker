import { ArgTypes, Meta, type StoryFn } from "@storybook/vue3";
import { ColorPicker } from "../../packages";
import type { ColorPickerProps } from "../../packages";
import { ref } from "vue";
import { ColorInput } from "tinycolor2";

import "./colorpicker.scss";

export default {
  title: "Example/ColorPicker",
  component: ColorPicker,
  argTypes: {
    pureColor: {
      type: "string",
      description: "hex string or rgba string",
    },
    gradientColor: {
      type: "string",
      table: {
        type: {
          summary: "linear-gradient",
        },
        defaultValue: {
          summary: "linear-gradient",
          detail: "linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)",
        },
      },
    },
    isWidget: {
      type: "boolean",
      description: "Whether it is a pop-up layer component ?",
      table: {
        defaultValue: {
          summary: false,
        },
      },
    },
    pickerType: {
      type: "string",
      description: "fk | chrome",
      control: { type: "select" },
      options: ["fk", "chrome"],
      table: {
        defaultValue: {
          summary: "fk",
        },
      },
    },
    shape: {
      type: "string",
      description: "circle | square",
      table: {
        defaultValue: {
          summary: "square",
        },
      },
    },
    useType: {
      type: "string",
      description: "pure | gradient | both",
      control: { type: "select" },
      options: ["pure", "gradient", "both"],
      table: {
        defaultValue: {
          summary: "pure",
        },
      },
    },
    format: {
      type: { name: "string", required: false },
      control: { type: "select" },
      options: ["rgb", "prgb", "hex", "hex6", "hex3", "hex4", "hex8", "name", "hsl", "hsv"],
      table: {
        defaultValue: {
          summary: "hex",
        },
      },
      description: `"rgb" | "prgb" | "hex" | "hex6" | "hex3" | "hex4" | "hex8" | "name" | "hsl" | "hsv"`,
    },
    disableHistory: {
      type: "boolean",
      table: {
        defaultValue: {
          summary: false,
        },
      },
      description: "",
    },
    roundHistory: {
      type: "boolean",
      table: {
        defaultValue: {
          summary: false,
        },
      },
      description: "",
    },
    disableAlpha: {
      type: "boolean",
      table: {
        defaultValue: {
          summary: false,
        },
      },
      description: "",
    },
    zIndex: {
      type: "number",
      table: {
        defaultValue: {
          summary: 0,
        },
      },
      description: "",
    },
    lang: {
      type: "string",
      description: "ZH-cn | En",
      control: { type: "select" },
      options: ["ZH-cn", "En"],
      table: {
        defaultValue: {
          summary: "ZH-cn",
        },
      },
    },
    debounce: {
      type: "number",
      table: {
        defaultValue: {
          summary: 0,
        },
      },
      description: "Debounce timer for the 'change' event.",
    },
    pickerContainer: {
      type: "string",
      table: {
        defaultValue: {
          summary: "body",
        },
      },
      description: "The mount node for picker popup",
    },
    theme: {
      type: "string",
      description: "white | black",
      control: { type: "select" },
      options: ["white", "black"],
      table: {
        defaultValue: {
          summary: "white",
        },
      },
    },
    blurClose: {
      type: "boolean",
      table: {
        defaultValue: {
          summary: false,
        },
      },
      description: "Auto close picker popup when mouse leave (only isWidget is false)",
    },
    defaultPopup: {
      type: "boolean",
      table: {
        defaultValue: {
          summary: false,
        },
      },
      description: "Picker popup is visible by default (only isWidget is false)",
    },
    extra: {
      description: "Add custom template on picker footer, example: rest button",
    },
  } as Partial<ArgTypes<ColorPickerProps>>,
} as Meta;

const Template: StoryFn<ColorPickerProps> = (args: ColorPickerProps | any) => {
  return {
    components: { ColorPicker },
    setup() {
      const pureColor = ref<ColorInput>("");
      const gradientColor = ref<ColorInput>("");
      return { args: args, pureColor, gradientColor };
    },
    template: `<div class="demo">
        <ColorPicker v-model:pureColor="pureColor" v-model:gradientColor="gradientColor" v-bind="args">
          <template v-if="${"extra" in args}" v-slot:extra>${args.extra}</template>
        </ColorPicker>
        <div class="demo-mt">currentColor: {{pureColor}} </div>
        <div class="demo-mt" v-if="gradientColor">currentGradientColor: {{gradientColor}} </div>
      </div>`,
  };
};

export const Square: StoryFn<ColorPickerProps> = Template.bind({});

Square.args = {
  isWidget: false,
  format: "rgb",
  shape: "square",
};

export const Circle: StoryFn<ColorPickerProps> = Template.bind({});

Circle.args = {
  isWidget: false,
  format: "rgb",
  shape: "circle",
};

export const Gradient: StoryFn<ColorPickerProps> = Template.bind({});

Gradient.args = {
  isWidget: false,
  format: "rgb",
  shape: "circle",
  useType: "gradient",
};

export const PopupUseTypeBoth: StoryFn<ColorPickerProps> = Template.bind({});

PopupUseTypeBoth.args = {
  isWidget: false,
  format: "rgb",
  shape: "circle",
  useType: "both",
};

export const PopupUseTypeBothWidget: StoryFn<ColorPickerProps> = Template.bind({});

PopupUseTypeBothWidget.args = {
  isWidget: true,
  format: "rgb",
  shape: "circle",
  useType: "both",
};

export const FK: StoryFn<ColorPickerProps> = Template.bind({});

FK.args = {
  isWidget: true,
  pickerType: "fk",
};

export const Chrome: StoryFn<ColorPickerProps> = Template.bind({});

Chrome.args = {
  isWidget: true,
  pickerType: "chrome",
};

export const RoundHistory: StoryFn<ColorPickerProps> = Template.bind({});

RoundHistory.args = {
  isWidget: true,
  pickerType: "fk",
  roundHistory: true,
};

export const DisableHistory: StoryFn<ColorPickerProps> = Template.bind({});

DisableHistory.args = {
  isWidget: true,
  pickerType: "fk",
  disableHistory: true,
};

export const DisableAlpha: StoryFn<ColorPickerProps> = Template.bind({});

DisableAlpha.args = {
  isWidget: true,
  pickerType: "fk",
  disableAlpha: true,
};

export const ExtraSlot: StoryFn<ColorPickerProps | any> = Template.bind({});

ExtraSlot.args = {
  isWidget: true,
  extra: `<div class='btn-reset' @click="pureColor='#5d35b0'">Reset</div>`,
};
