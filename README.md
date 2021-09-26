# colorpicker

非常漂亮的一款拾色器,灵感来源于 [凡科建站](https://fkw.com/) 的拾色器。同时参照了 [element-plus](https://element-plus.org/#/zh-CN/component/color-picker) 以及 [vue-color](https://github.com/xiaokaike/vue-color) 的思路；作为一名纯粹的后端人员,我从来没有想过我竟然来写拾色器这个 vue 插件。

![](https://aesoper101.github.io/vue3-colorpicker/1.png)

[在线 demo 演示](https://aesoper101.github.io/vue3-colorpicker/)

## 安装

```
yarn add vue3-colorpicker
```

或者

```
npm install vue3-colorpicker
```

## 如何使用

### 第一步全局注册

```
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

createApp(App)
  .use(router)
  .use(Vue3ColorPicker)
  .mount("#app");
```

### 使用组件

```vue
<fk-color-picker v-model:color="color" />
```

![](https://aesoper101.github.io/vue3-colorpicker/2.PNG)

```vue
<chrome-color-picker v-model:color="color" :history-round="true" />
```

![](https://aesoper101.github.io/vue3-colorpicker/3.PNG)

```vue
<ele-color-picker v-model:color="color" />
```

![](https://aesoper101.github.io/vue3-colorpicker/4.PNG)

```
 <！-- 有弹出功能的拾色器 -->
 <popu-color-picker v-model:color="color" />
```

![](https://aesoper101.github.io/vue3-colorpicker/5.PNG)

## 数据输入输出

```js
// 不同格式的数据输入输出

const colors: ColorAttrs = {
  // 默认的color输出格式
  hsl: {
    h: 0,
    s: 0.56,
    l: 0.38,
    a: 1,
  },
  hex: "#992B2B",
  hex8: "#992B2BFF",
  rgb: {
    r: 153,
    g: 43,
    b: 43,
    a: 1,
  },
  hsv: {
    h: 0,
    s: 0.72,
    v: 0.6,
    a: 1,
  },
  oldHue: 0,
  source: "saturation",
  alpha: 1,
};
// or
const colors = "#194d33";
// or
const colors = "#194D33A8";
// or
const colors = { h: 150, s: 0.66, v: 0.3 };
// or
const colors = { r: 255, g: 0, b: 0 };
```

如果你需要一种固定的 color 值输出格式,您需要给组件的 formate 属性赋值(除了 popu-color-picker);format 允许的类型如下：

```typescript
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
```

如果想让 popu-color-picker 组件也输出固定格式的 color 值,需要给 popu-color-picker 组件的 pickerProps 属性赋值, pickerProps 属性选项跟您填入的 mode 属性相关; mode 的值如下:

```typescript
export type PickerMode = "fk" | "chrome" | "ele";
```

如果您`mode="chrome"`,则弹出的拾色器为`chrome-color-picker`.此时 pickerProps 的值即为`chrome-color-picker`组件的属性值。下同如果您`mode="fk"`,则弹出的拾色器为`fk-color-picker`. 默认为`fk` 如果您`mode="ele"`,则弹出的拾色器为`ele-color-picker`.

举例：

```vue
<popu-color-picker v-model:color="color" mode="chrome" :chrome-color-picker="{ format: 'hex' }" />
```

说明: 以上组件弹出的拾色器为`chrome-color-picker`, 输出的 color 格式为 `hex`字符串类型, ![](https://aesoper101.github.io/vue3-colorpicker/6.PNG)

## 由于写得匆忙，文档以及代码结构很烂。后续优化更新
