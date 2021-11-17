import { ComputedRef } from "vue";

export type SupportLang = "ZH-cn" | "En";

export interface ColorPickerProvider {
  lang: ComputedRef<SupportLang>;
}

export const ColorPickerProviderKey = "Vue3ColorPickerProvider";
