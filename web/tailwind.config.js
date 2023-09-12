/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'primary': "#CC305A",
      'white': "#FFFFFF",
      'black': "#000000",
      'label': "#FFC400",
      'tran': "rgb(0 0 0 / 0.55)",
      'action-div': "#3E0C57",
      'nav-bar': "#121212",
      'default': "#2F1643",
      'pixel-blue': "#19C0DB",
      'address': "#970A4C",
      'active-zoom': "#A174E3",
      'notification': "#FF0000"
    },
    extend: {
      backgroundImage: {
        'home': "url('/assets/home_bg.png')",
        'icon': "url/('assets/icon.png')"
      },
      fontFamily: {
        subtitle: ['Segoe UI', 'sans-serif'],
        noto: ['Noto Sans', 'sans-serif'],
        primary: ['Silkscreen', 'sans-serif'],
        emoji: ['Noto Emoji']
      },
      boxShadow: {
        'actionDiv': "0px 3px 12px #0000008A"
      }
    },
  },
  plugins: [],
}
