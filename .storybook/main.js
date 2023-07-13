const path = require("path");
module.exports = {
  async viteFinal(config, {
    configType
  }) {
    if (configType === "DEVELOPMENT") {
      // customize the Vite config here
      config.server.port = 6001;
      config.server.https = false;
      config.server.host = true;
      config.server.hmr = {
        port: 443,
        protocol: "ws"
      };
    } else {
      config.base = "/vue3-colorpicker/";
    }
    // return the customized config
    return config;
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", {
    name: "@storybook/addon-docs",
    options: {
      sourceLoaderOptions: {
        injectStoryParameters: false
      }
    }
  }, "@storybook/addon-essentials", "@storybook/addon-mdx-gfm"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {}
  },
  docs: {
    autodocs: true
  }
};