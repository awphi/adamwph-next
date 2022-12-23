/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  // These paths are just examples, customize them to match your project structure
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [],
};
