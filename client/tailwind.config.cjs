module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    styled: true,
    themes: [
      'light',
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          'base-100': '#000000',
          'base-200': '#1c1c1e',
          'base-300': '#2c2c2e',
          'base-content': '#e5e7eb'
        }
      }
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
    darkTheme: 'dark'
  }
}
