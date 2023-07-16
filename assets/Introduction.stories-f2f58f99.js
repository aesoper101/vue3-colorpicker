import{r as h,M as x}from"./chunk-PCJTTTQV-a341f4b7.js";import{u as d}from"./index-cf514b81.js";import"./iframe-714d8c7d.js";import"../sb-preview/runtime.js";import"./doctrine-e7caf968.js";import"./index-d475d2ea.js";import"./index-d37d4223.js";import"./index-356e4a49.js";var u={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=h,j=Symbol.for("react.element"),g=Symbol.for("react.fragment"),_=Object.prototype.hasOwnProperty,v=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,k={key:!0,ref:!0,__self:!0,__source:!0};function m(n,e,c){var o,t={},l=null,p=null;c!==void 0&&(l=""+c),e.key!==void 0&&(l=""+e.key),e.ref!==void 0&&(p=e.ref);for(o in e)_.call(e,o)&&!k.hasOwnProperty(o)&&(t[o]=e[o]);if(n&&n.defaultProps)for(o in e=n.defaultProps,e)t[o]===void 0&&(t[o]=e[o]);return{$$typeof:j,type:n,key:l,ref:p,props:t,_owner:v.current}}s.Fragment=g;s.jsx=m;s.jsxs=m;u.exports=s;var r=u.exports;function a(n){const e=Object.assign({h1:"h1",p:"p",a:"a",h2:"h2",pre:"pre",code:"code",h3:"h3"},d(),n.components);return r.jsxs(r.Fragment,{children:[r.jsx(x,{title:"Example/Introduction"}),`
`,r.jsx(e.h1,{id:"colorpicker",children:"colorpicker"}),`
`,r.jsx(e.p,{children:"A very beautiful color picker, supports input and output of multiple color formats, and supports gradient color selection."}),`
`,r.jsx(e.p,{children:r.jsx(e.a,{href:"https://aesoper101.github.io/vue3-colorpicker/",target:"_blank",rel:"nofollow noopener noreferrer",children:"Live Demo"})}),`
`,`
`,r.jsx(e.h2,{id:"installation",children:"Installation"}),`
`,r.jsx(e.pre,{children:r.jsx(e.code,{children:`yarn add vue3-colorpicker
`})}),`
`,r.jsx(e.p,{children:"OR"}),`
`,r.jsx(e.pre,{children:r.jsx(e.code,{children:`npm install vue3-colorpicker
`})}),`
`,r.jsx(e.h2,{id:"how-to-use",children:"How to use"}),`
`,r.jsx(e.h3,{id:"the-first-step-is-global-registration",children:"The first step is global registration"}),`
`,r.jsx(e.pre,{children:r.jsx(e.code,{children:`import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

createApp(App)
  .use(router)
  .use(Vue3ColorPicker)
  .mount("#app");
`})}),`
`,r.jsx(e.p,{children:"OR"}),`
`,r.jsx(e.pre,{children:r.jsx(e.code,{className:"language-vue3",children:`import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

export default defineComponent({
components: { ColorPicker },
});
`})}),`
`,r.jsx(e.h3,{id:"usage",children:"Usage"}),`
`,r.jsx(e.pre,{children:r.jsx(e.code,{className:"language-vue3",children:`<template>
  <div>
     <color-picker v-model:pureColor="pureColor" v-model:gradientColor="gradientColor"/>
  </div>
</template>
<script lang="ts">
  import { ref } from "vue";
  import { ColorInputWithoutInstance } from "tinycolor2";

  export default defineComponent({
     setup() {
       const pureColor = ref<ColorInputWithoutInstance>("red");
       const gradientColor = ref("linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)");

       return { pureColor, gradientColor }
     }
  });
<\/script>

`})}),`
`,r.jsx(e.h3,{id:"nuxt3-build-issue",children:"Nuxt3 Build Issue"}),`
`,r.jsx(e.p,{children:"you can add the config in nuxt.config.ts:"}),`
`,r.jsx(e.pre,{children:r.jsx(e.code,{children:`export default defineNuxtConfig({
  build: {
    transpile: ['vue3-colorpicker']
  },
})
`})})]})}function C(n={}){const{wrapper:e}=Object.assign({},d(),n.components);return e?r.jsx(e,{...n,children:r.jsx(a,{...n})}):a(n)}const y=()=>{throw new Error("Docs-only story")};y.parameters={docsOnly:!0};const i={title:"Example/Introduction",tags:["stories-mdx"],includeStories:["__page"]};i.parameters=i.parameters||{};i.parameters.docs={...i.parameters.docs||{},page:C};const M=["__page"];export{M as __namedExportsOrder,y as __page,i as default};
//# sourceMappingURL=Introduction.stories-f2f58f99.js.map
