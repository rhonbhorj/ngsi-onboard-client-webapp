/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Admin Colors
        'admin': {
          'button-bg': '#003c6e',
          'button-hover-bg': '#05113b',
          'accent': '#2bc4ad',
        },
        // Form Colors
        'form': {
          'button-bg': '#016cfb',
        },
        // Base Colors
        'white-text': '#ffffff',
        'dark-text': '#05113b',
        'light-gray': '#f2f2f2',
        // Keep some standard colors for compatibility
        'blue-gray': '#dae3f3',
      },
    },
  },
  plugins: [],
};
