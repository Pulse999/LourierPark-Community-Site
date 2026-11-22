
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#092b40",
          green: "#277a43",
          gold: "#eca02c",
        },

        surface: {
          warm: "#f7f8f5",
          sage: "#e9efea",
          muted: "#eef2ed",
        },

        slate: {
          DEFAULT: "#52616b",
        },
      },

      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },

      maxWidth: {
        site: "1200px",
      },
    },
  },

  plugins: [],
};
