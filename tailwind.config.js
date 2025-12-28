/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        "sunset-start": "#fbbf24",
        "sunset-end": "#fecdd3",
      },
      backgroundImage: {
        sunset: "linear-gradient(180deg, #fbbf24, #fecdd3)",
      },
    },
  },
  plugins: [],
};
