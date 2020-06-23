const { createObject } = require('../../utils');

module.exports.angularMetrics = createObject([
  'USE_JEST',
  'NG_BUILD',
  'USE_HTTP_CLIENT',
  'COMPONENTS_LENGTH',
  'TEMPLATE_LENGTH',
  'SERVICE_PER_SCREEN',
  'PRODUCTION_MODE_ENABLED'
]);

module.exports.limits = {
  minTestCoverage: 80,
  maxUnusedDependencies: 10,
  pwaMin: 30,
  maxNumberOfComponentLines: 200,
  maxNumberOfTemplateLines: 150,
  minBestPractices: 70,
  minSeo: 90,
  minFirstPaint: 50
};
