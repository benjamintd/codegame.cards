const colors = require("tailwindcss/colors");

module.exports = {
  theme: {
    fontFamily: {
      mono: ["Courier Prime", "monospace"],
    },
    extend: {
      colors: {
        accent: "#2552f5",
        discord: {
          400: "#8398E0",
          500: "#7289DA",
          600: "#627BC0",
          700: "#536CA6",
        },
        blue: {
          100: "#ebf8ff",
          200: "#bee3f8",
          300: "#90cdf4",
          400: "#63b3ed",
          500: "#4299e1",
          600: "#3182ce",
          700: "#2b6cb0",
          800: "#2c5282",
          900: "#2a4365",
        },
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
};
