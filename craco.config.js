/* eslint-disable global-require */
// craco.config.js
module.exports = {
  style: {
    postcss: {
      // eslint-disable-next-line import/no-unresolved
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  }
};
