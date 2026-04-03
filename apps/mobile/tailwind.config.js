const baseConfig = require("@hugg/config/tailwind.config.base");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
};
