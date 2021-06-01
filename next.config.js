const nextTranslate = require('next-translate');
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
  },
  ...nextTranslate(),
});
