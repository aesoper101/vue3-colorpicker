import tinycolor, { Instance } from "tinycolor2";
import { isDef, isNull } from "@aesoper/normal-utils";

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

export interface Color {
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

export class ColorClass {
  protected instance: Instance = tinycolor("#000000");
}

export const parseColor = (data: any, oldHue?: number): Color => {
  let instance: Instance;

  if (isDef(data) || isNull(data)) {
    data = "#000000";
  }

  if (data && data.hsl) {
    instance = tinycolor(data.hsl);
  } else if (data && data.hex && data.hex.length > 0) {
    instance = tinycolor(data.hex);
  } else if (data && data.hex8 && data.hex8.length > 0) {
    instance = tinycolor(data.hex8);
  } else if (data && data.hsv) {
    instance = tinycolor(data.hsv);
  } else if (data && data.rgba) {
    instance = tinycolor(data.rgba);
  } else if (data && data.rgb) {
    instance = tinycolor(data.rgb);
  } else {
    instance = tinycolor(data);
  }

  const hsl = instance.toHsl();
  const hsv = instance.toHsv();

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
      s: Math.round(hsl.s * 100) / 100,
      l: Math.round(hsl.l * 100) / 100,
      a: hsl.a
    },
    hex: instance.toHexString().toUpperCase(),
    hex8: instance.toHex8String().toUpperCase(),
    rgb: instance.toRgb(),
    hsv: {
      h: Math.round(hsv.h),
      s: Math.round(hsv.s * 100) / 100,
      v: Math.round(hsv.v * 100) / 100,
      a: hsl.a
    },
    oldHue: data.h || oldHue || hsl.h,
    source: data.source,
    alpha: data.a || instance.getAlpha()
  };
};
