export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        primary: { 50:"#eff6ff", 100:"#dbeafe", 500:"#3b82f6", 600:"#2563eb", 700:"#1d4ed8", 800:"#1e40af" },
        accent: { 400:"#fb923c", 500:"#f97316" }
      }
    }
  },
  plugins: []
}
