import tinycolor, { Instance } from "tinycolor2";
import { isDef, isNull } from "@aesoper/normal-utils";
import debounce from "lodash.debounce";

export interface Alpha {
  a: number;
}

export interface PRGB {
  r: string;
  g: string;
  b: string;
}

export interface PRGBA extends PRGB, Alpha {}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB, Alpha {}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSLA extends HSL, Alpha {}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface HSVA extends HSV {
  a: number;
}

export interface ColorInstance {
  hex?: string;
  hex8?: string;
  hsl?: HSLA;
  hsv?: HSVA;
  rgb?: RGBA;
  alpha?: number;
  source?: string;
  oldHue?: number;
}

export interface ColorAttrs {
  hex: string;
  hex8: string;
  hsl: HSLA;
  hsv: HSVA;
  rgb: RGBA;
  alpha: number;
  source: string;
  oldHue: number;
}

type ColorInputWithoutInstance =
  | string
  | PRGB
  | PRGBA
  | RGB
  | RGBA
  | HSL
  | HSLA
  | HSV
  | HSVA;

export type ColorInput = ColorInstance | ColorInputWithoutInstance;

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

export class Color {
  protected instance: Instance = tinycolor("#000000");

  parseColor(data: any, oldHue?: number): ColorAttrs {
    if (isDef(data) || isNull(data)) {
      data = "#000000";
    }

    if (data && data.hsl) {
      this.instance = tinycolor(data.hsl);
    } else if (data && data.hex && data.hex.length > 0) {
      this.instance = tinycolor(data.hex);
    } else if (data && data.hex8 && data.hex8.length > 0) {
      this.instance = tinycolor(data.hex8);
    } else if (data && data.hsv) {
      this.instance = tinycolor(data.hsv);
    } else if (data && data.rgba) {
      this.instance = tinycolor(data.rgba);
    } else if (data && data.rgb) {
      this.instance = tinycolor(data.rgb);
    } else {
      this.instance = tinycolor(data);
    }

    const hsl = this.instance.toHsl();
    const hsv = this.instance.toHsv();
    const rgb = this.instance.toRgb();

    if (hsl.s === 0) {
      hsv.h = hsl.h = data.h || (data.hsl && data.hsl.h) || oldHue || 0;
    }

    if (hsv.h === 0 || hsl.h === 0) {
      hsv.h = hsl.h = data.h || oldHue || data.oldHue || 0;
    }

    if (hsv.v === 0) {
      hsv.s = (data.s && data.s) || (data.hsv && data.hsv.s) || 0;
    }

    return {
      hsl: {
        h: Math.round(hsl.h),
        s: Number(Math.round(hsl.s * 100).toFixed(2)) / 100,
        l: Number(Math.round(hsl.l * 100).toFixed(2)) / 100,
        a: Math.round(hsl.a * 100) / 100
      },
      hex: this.instance.toHexString().toUpperCase(),
      hex8: this.instance.toHex8String().toUpperCase(),
      rgb: {
        r: Math.round(rgb.r),
        g: Math.round(rgb.g),
        b: Math.round(rgb.b),
        a: Math.round(rgb.a * 100) / 100
      },
      hsv: {
        h: Math.round(hsv.h),
        s: Math.round(hsv.s * 100) / 100,
        v: Math.round(hsv.v * 100) / 100,
        a: Math.round(hsl.a * 100) / 100
      },
      oldHue: Math.round(data.h || oldHue || hsl.h),
      source: data.source,
      alpha: Math.round((data.a || this.instance.getAlpha()) * 100) / 100
    };
  }

  format(format: ColorFormat): string {
    return this.instance.toString(format);
  }
}

export const debounceFn = debounce(
  (fn: Function) => {
    fn();
  },
  200,
  {
    leading: true,
    trailing: false
  }
);

export const MAX_STORAGE_LENGTH = 8;
export const STORAGE_COLOR_KEY = "colorList";
