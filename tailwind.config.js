/** @type {import('tailwindcss').Config} */
module.exports = {
  // Do not follow OS/browser dark mode; only apply `dark:` with a manual `.dark` class.
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  plugins: [require('tailwindcss-primeui')],
};
