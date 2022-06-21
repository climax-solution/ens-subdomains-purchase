module.exports = {
  content: [
    "./pages/**/*.{js, ts, jsx, tsx, html}",
    "./components/**/*.{js, ts, jsx, tsx, html}",
  ],
  theme: {
    screens: {
      'xxs': "370px",
      'xs': "490px",
      'sm': "640px",
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    },
    extend: {
      maxWidth: {
        xxs: "300px"
      },
      zIndex: {
        '9999': '9999'
      }
    }
  },
  plugins: [
  ],
}
