import tinycolor, { ColorInput } from "tinycolor2";

export type ColorFormat =
  | "rgb"
  | "prgb"
  | "hex"
  | "hex6"
  | "hex3"
  | "hex4"
  | "hex8"
  | "name"
  | "hsl"
  | "hsv";

const double = (num: number) => {
  return Math.round(num * 100) / 100;
};

export class Color {
  private instance: tinycolor.Instance;
  private alphaValue = 0;

  // RGB
  private redValue = 0;
  private greenValue = 0;
  private blueValue = 0;

  // HSV
  private hueValue = 0;
  private saturationValue = 0;
  private brightnessValue = 0;

  // HSL
  private hslSaturationValue = 0;
  private lightnessValue = 0;

  constructor(input?: ColorInput) {
    this.instance = tinycolor(input);

    this.initRgb();
    this.initHsb();
    this.initLightness();
    this.initAlpha();
  }

  private initAlpha = () => {
    const initAlpha = this.instance.getAlpha();
    this.alphaValue = Math.min(1, initAlpha) * 100;
  };

  private initLightness = () => {
    const { s, l } = this.instance.toHsl();
    this.hslSaturationValue = double(s);
    this.lightnessValue = double(l);
  };

  private initRgb = () => {
    const { r, g, b } = this.instance.toRgb();

    this.redValue = double(r);
    this.greenValue = double(g);
    this.blueValue = double(b);
  };

  private initHsb = () => {
    const { h, s, v } = this.instance.toHsv();

    this.hueValue = Math.min(360, Math.ceil(h));
    this.saturationValue = double(s);
    this.brightnessValue = double(v);
  };

  toString(format?: ColorFormat) {
    return this.instance.toString(format);
  }

  toHexString = () => {
    return this.instance.toHexString();
  };

  toRgbString = () => {
    return this.instance.toRgbString();
  };

  get hex() {
    return this.instance.toHex();
  }

  set hex(hexString: string) {
    this.instance = tinycolor(hexString);
    this.initHsb();
    this.initRgb();
    this.initAlpha();
    this.initLightness();
  }

  // 色调
  set hue(value: number) {
    if (this.saturation === 0 && this.brightness === 0) {
      this.saturationValue = 1;
      this.brightnessValue = 1;
    }
    this.instance = tinycolor({
      h: double(value),
      s: this.saturation,
      v: this.brightness,
      a: this.alphaValue / 100,
    });

    this.initRgb();
    this.initLightness();
    this.hueValue = double(value);
  }

  get hue() {
    return this.hueValue;
  }

  // 饱和度
  set saturation(value: number) {
    this.instance = tinycolor({
      h: this.hue,
      s: double(value),
      v: this.brightness,
      a: this.alphaValue / 100,
    });

    this.initRgb();
    this.initLightness();
    this.saturationValue = double(value);
  }

  get saturation() {
    return this.saturationValue;
  }

  // 明度
  set brightness(value: number) {
    this.instance = tinycolor({
      h: this.hue,
      s: this.saturation,
      v: double(value),
      a: this.alphaValue / 100,
    });

    this.initRgb();
    this.initLightness();
    this.brightnessValue = double(value);
  }

  get brightness() {
    return this.brightnessValue;
  }

  // 亮度
  set lightness(value: number) {
    this.instance = tinycolor({
      h: this.hue,
      s: this.hslSaturationValue,
      l: double(value),
      a: this.alphaValue / 100,
    });

    this.initRgb();
    this.initHsb();
    this.lightnessValue = double(value);
  }

  get lightness() {
    return this.lightnessValue;
  }

  // red
  set red(value: number) {
    const rgb = this.instance.toRgb();
    this.instance = tinycolor({
      ...rgb,
      r: double(value),
      a: this.alphaValue / 100,
    });

    this.initHsb();
    this.initLightness();
    this.redValue = double(value);
  }

  get red() {
    return this.redValue;
  }

  // green
  set green(value: number) {
    const rgb = this.instance.toRgb();
    this.instance = tinycolor({
      ...rgb,
      g: double(value),
      a: this.alphaValue / 100,
    });

    this.initHsb();
    this.initLightness();
    this.greenValue = double(value);
  }

  get green() {
    return this.greenValue;
  }

  // blue
  set blue(value: number) {
    const rgb = this.instance.toRgb();
    this.instance = tinycolor({
      ...rgb,
      b: double(value),
      a: this.alphaValue / 100,
    });

    this.initHsb();
    this.initLightness();
    this.blueValue = double(value);
  }

  get blue() {
    return this.blueValue;
  }

  // alpha
  set alpha(value: number) {
    this.instance.setAlpha(value / 100);
    this.alphaValue = value;
  }

  get alpha() {
    return this.alphaValue;
  }

  get RGB() {
    return [this.red, this.green, this.blue, this.alpha / 100];
  }

  get HSB() {
    return [this.hue, this.saturation, this.brightness, this.alpha / 100];
  }

  get HSL() {
    return [this.hue, this.hslSaturationValue, this.lightness, this.alpha / 100];
  }
}

export function rgbaColor(r: number, g: number, b: number, a: number) {
  return `rgba(${[r, g, b, a / 100].join(",")})`;
}

export const clamp = (value: number, min: number, max: number) => {
  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value;
};

export const HistoryColorKey = "color-history";

export const MAX_STORAGE_LENGTH = 8;
