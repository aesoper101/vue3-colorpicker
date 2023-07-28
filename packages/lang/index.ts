import enUS from "./en-US";
import zhCn from "./zh-CN";

export type Lang = "ZH-cn" | "En";

export const Local: { [K in Lang]: { [key: string]: string } } = {
  En: enUS,
  "ZH-cn": zhCn,
};
