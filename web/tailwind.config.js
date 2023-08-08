/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'game-panel': "url('/bg_gamePanel.jpg')",
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        noto: ['Noto Sans', 'sans-serif'],
      },
      colors: {
        'option-1': "#D5EDF6",
        'option-2': "#87F3FF",
        'option-3': "#59B2C9",
        'option-4': "#127994",
        'option-5': "#45607B",
        'option-6': "#141414",
        'custom-blue': "#59B2C9"
      }
    },
  },
  plugins: [],
}
