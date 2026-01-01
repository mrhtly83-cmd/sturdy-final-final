/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Clinical Luxury Design System - designed to lower cortisol
        "clinical-base": "#F8FAFC",      // Off-white/Slate 50 - calming background
        "clinical-text": "#0F172A",      // Deep Navy - clear, readable text
        "clinical-action": "#334155",    // Slate 700 - trustworthy actions
        "clinical-accent": "#94A3B8",    // Muted Sage - subtle highlights
        "clinical-sos": "#CA8A04",       // Muted Gold - crisis/alert state
        
        // Legacy sunset colors (keeping for backward compatibility)
        "sunset-start": "#fbbf24",
        "sunset-end": "#fecdd3",
      },
      backgroundImage: {
        sunset: "linear-gradient(180deg, #fbbf24, #fecdd3)",
        clinical: "linear-gradient(180deg, #F8FAFC, #FFFFFF)",
      },
      letterSpacing: {
        calm: "0.025em",                 // Generous spacing for stress reduction
      },
      lineHeight: {
        "relaxed-plus": "1.625",         // leading-relaxed for readability during stress
      },
      borderRadius: {
        "clinical": "1rem",              // rounded-2xl for soft, calming corners
      },
    },
  },
  plugins: [],
};
