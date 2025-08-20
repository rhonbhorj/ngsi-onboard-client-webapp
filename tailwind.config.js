/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        'navy-900': '#05113B',
        'blue-600': '#016CFB',
        'teal-400': '#2BC4AD',
        'gray-100': '#F2F2F2',
        'blue-100': '#DAE3F3',
        'blue-900': '#013D8D',
        'blue-800': '#014DB3',
        'netpay-white': '#FFFFFF',
        'netpay-dark-blue': '#05113B',
        'netpay-primary-blue': '#016CFB',
        'netpay-teal': '#2BC4AD',
        'netpay-light-gray': '#F2F2F2',
        'netpay-blue-gray': '#DAE3F3',
        'netpay-medium-blue': '#013D8D',
        'netpay-accent-blue': '#014DB3',
      },
    },
  },
  plugins: [primeui],
};
