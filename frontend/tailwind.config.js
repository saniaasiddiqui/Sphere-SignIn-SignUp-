/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B132B",
          900: "#111A38",
          800: "#1C2541",
          700: "#293361",
        },
        canvas: "#F8F9FA",
        line: "#E7E7EA",
        indigo: {
          500: "#3D5AFE",
          600: "#3348D6",
        },
        ok: "#2E7D5B",
        warn: "#B3552B",
        danger: "#C24141",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "14px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,19,43,0.04), 0 1px 8px rgba(11,19,43,0.04)",
        pop: "0 12px 40px rgba(11,19,43,0.18)",
      },
    },
  },
  plugins: [],
};
