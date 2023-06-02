/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'white': '#ffffff',
      'black': '#000000',
      'neutral': {
        1: '#fafafa',
        2: '#eeeeee',
        3: '#e0e0e0',
        4: '#bdbdbd',
        5: '#9e9e9e',
        6: '#757575',
        7: '#616161',
        8: '#424242',
        9: '#212121',
        10: '#0E0E0E',
      },
      'blue': {
        0: '#E1F5FF',
        1: '#B3E5FF',
        2: '#7FD5FF',
        3: '#48C4FF',
        4: '#17B7FF',
        5: '#00AAFF',
        6: '#009CF6',
        7: '#0488E1',
        8: '#0477CC',
        9: '#0D57AA',
      }
    },
    extend: {
      top: {
        '74px': "74px",
      },
      left: {
        '240px': "240px",
      },
      width: {
        '270px': "270px",
      },
      height: {
        '74px': "74px",
      },
      boxShadow: {
        'light': '0px 0px 4px 0px #E0E0E0',
        'dark': '0px 0px 4px 0px #424242',
      },
    },
  },
  plugins: [],
}

