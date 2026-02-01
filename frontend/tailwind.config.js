/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#18468c", // El azul exacto del Tec
        "primary-dark": "#0f131a", // El fondo oscuro
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"], 
      },
    },
  },
  plugins: [],
}