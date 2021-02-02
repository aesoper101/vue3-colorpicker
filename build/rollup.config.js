import path from "path";
// import vue from "rollup-plugin-vue";
import commonjs from "@rollup/plugin-commonjs";

import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import auto from "@rollup/plugin-auto-install";

import pkg from "../package.json";

const projectRoot = path.resolve(__dirname, "..");

export default [
  {
    input: path.resolve(projectRoot, "utils/index.ts"),
    output: {
      format: "esm",
      file: pkg.module,
      exports: "named"
    },
    plugins: [
      auto(),
      nodeResolve(),
      // vue({
      //   target: "browser",
      //   css: false,
      //   exposeFilename: false
      // }),
      typescript({
        tsconfigOverride: {
          include: ["utils/*.ts"],
          exclude: ["node_modules", "utils/**/__tests__/*"]
        },
        abortOnError: false
      }),

      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: pkg.browserslist
            }
          ],
          ["@babel/preset-typescript"]
        ],
        babelHelpers: "runtime",
        exclude: ["node_modules/**"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        comments: false,
        sourceMap: false
      }),
      commonjs(),
      terser()
    ]
  }
];
