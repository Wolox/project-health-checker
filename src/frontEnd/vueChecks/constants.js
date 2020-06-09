const { createObject } = require('../../utils');

module.exports.vueMetrics = createObject([
  'USE_CLI_SERVICE',
  'SCOPED_STYLES',
  'VUE_TEMPLATE',
  'USE_VUEX',
  'STATE_MODULES',
  'I18N',
  'VALID_LINES_LENGTH',
  'USE_LAZY_ROUTES'
]);

module.exports.limits = {
  i18nPercentage: 40,
  minSeo: 80,
  minTestCoverage: 70,
  maxUnusedDependencies: 10,
  pwaMin: 30,
  minFirstPaintScore: 50,
  maxLines: 400,
  minBestPractices: 70
};
