const purgecss = require("@fullhuman/postcss-purgecss")();

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "@fullhuman/postcss-purgecss": {
      // Specify the paths to all of the template files in your project
      content: ["./src/**/*.html", "./src/**/*.jsx", "./src/**/*.tsx"],
      // Include any special characters you're using in this regular expression
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    },
  },
};
