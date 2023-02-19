const postcssPresetEnv = require("postcss-preset-env");
const autoprefixer = require("autoprefixer");
const atImport = require("postcss-import");
const url = require("postcss-url");

module.exports = {
  plugins: [
    url({
      url: "inline",
    }),
    atImport(),
    autoprefixer(),
    postcssPresetEnv({
      stage: 0,
      "nesting-rules": true,
    }),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
