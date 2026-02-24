/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        grayBg: "#999D9E",
        footerBg: "#1C1D20",
        primary: "#1C1C1C",
        accent: "#455CE9",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.76, 0, 0.24, 1)',
      }
    },
  },
  plugins: [],
}
