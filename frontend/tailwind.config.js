/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg:          "var(--bg)",
        surface:     "var(--surface)",
        accent:      "var(--accent)",
        "snap-text": "var(--text)",
        muted:       "var(--muted)",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body:    ["DM Sans", "sans-serif"],
        mono:    ["DM Mono", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        sm:     "var(--shadow-sm)",
        md:     "var(--shadow-md)",
        lg:     "var(--shadow-lg)",
        accent: "var(--shadow-accent)",
      },
    },
  },
  plugins: [],
}

