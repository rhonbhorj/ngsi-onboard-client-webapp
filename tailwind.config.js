/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Your custom NetPay color palette
        'netpay': {
          'white': '#FFFFFF',
          'dark-blue': '#05113B',
          'primary-blue': '#016CFB',
          'teal': '#2BC4AD',
          'light-gray': '#F2F2F2',
          'blue-gray': '#DAE3F3',
          'medium-blue': '#013D8D',
          'accent-blue': '#014DB3',
        },
        // Keep standard colors for compatibility
        'navy-900': '#05113B',
        'blue-600': '#016CFB',
        'teal-400': '#2BC4AD',
        'gray-100': '#F2F2F2',
        'blue-100': '#DAE3F3',
        'blue-900': '#013D8D',
        'blue-800': '#014DB3',
      },
    },
  },
  plugins: [],
};
