import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Inter is the one brand font (Latin). Farsi falls back to Vazirmatn
        // via the html[lang="fa"] rule in globals.css — Inter can't render
        // Persian script.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        vazirmatn: ["var(--font-vazirmatn)", "Vazirmatn", "system-ui"],
      },
      colors: {
        // ── Saba locked brand system — exact hex, no approximation. ──
        // No #000000 anywhere: black is reserved for the separate Rumi App.
        navy: "#0B1C36", // secondary bg: hero, CTA, footer, mobile menu (dark sections)
        accent: { DEFAULT: "#059669", hover: "#047857" }, // buttons, links, icons, headline accent, logo
        ink: "#111827", // primary heading + body text on white
        muted: "#6B7280", // secondary / supporting text on white
        surface: "#F9FAFB", // card + secondary-section fill (website only; = field by design)
        line: "#E5E7EB", // borders on cards, inputs, dividers
        danger: "#DC2626", // form validation errors only
        field: "#F9FAFB", // form input background
      },
      letterSpacing: {
        h1: "-0.03em",
        h2: "-0.02em",
        h3: "-0.01em",
        eyebrow: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
