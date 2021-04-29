module.exports = {
  purge: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  variants: {
    extend: {
      borderWidth: ["dark"],
    },
  },
};
