/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "reddit-orange": "#FF4500",
        "reddit-dark": "#1A1A1B",
        "reddit-light": "#F8F9FA",
        "reddit-border": "#EDEFF1",
      },
    },
  },
  plugins: [],
};
