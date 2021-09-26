module.exports = {
  root: true,
  plugins: [
    "stylelint-order",
    // "stylelint-no-unsupported-browser-features"
  ],
  extends: ["stylelint-config-standard", "stylelint-config-prettier"],
  rules: {
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep"],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "function",
          "if",
          "each",
          "include",
          "mixin",
          "extend",
          "use",
        ],
      },
    ],
    "no-empty-source": null,
    "named-grid-areas-no-invalid": null,
    "unicode-bom": "never",
    "no-descending-specificity": null,
    "font-family-no-missing-generic-family-keyword": null,
    "declaration-colon-space-after": "always-single-line",
    "declaration-colon-space-before": "never",
    "no-invalid-position-at-import-rule": null,
    // 'declaration-block-trailing-semicolon': 'always',
    "rule-empty-line-before": [
      "always",
      {
        ignore: ["after-comment", "first-nested"],
      },
    ],
    "unit-no-unknown": [true, { ignoreUnits: ["rpx"] }],
    // "plugin/no-unsupported-browser-features": [
    //   true,
    //   {
    //     browsers: ["> 0.5%", "last 2 versions", "Firefox ESR", "not dead", "IE 11", "not IE 10"],
    //     ignore: ["rem"],
    //     ignorePartialSupport: true,
    //     severity: "warning",
    //   },
    // ],
    "order/order": [
      [
        "dollar-variables",
        "custom-properties",
        "at-rules",
        "declarations",
        {
          type: "at-rule",
          name: "supports",
        },
        {
          type: "at-rule",
          name: "media",
        },
        "rules",
      ],
      { severity: "warning" },
    ],
  },
  ignoreFiles: ["**/*.js", "**/*.jsx", "**/*.tsx", "**/*.ts"],
};
