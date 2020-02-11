const { createObject } = require('../utils');

module.exports.eslintMetrics = createObject(['ESLINT_ERRORS', 'ESLINT_CONFIG']);

module.exports.eslintTechConfig = {
  react: 'wolox-react',
  vue: 'wolox-vue'
};
