/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#020710",
          card: "rgba(10, 20, 40, 0.6)",
          primary: "#00f2ff",
          secondary: "#7000ff",
          accent: "#ff00e5",
          border: "rgba(0, 242, 255, 0.2)",
          "border-glow": "rgba(0, 242, 255, 0.5)",
        },
      },
      backgroundImage: {
        "gradient-cyber": "linear-gradient(to right, #00f2ff, #7000ff)",
        "gradient-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(0, 242, 255, 0.5)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 40px rgba(70, 0, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
};
