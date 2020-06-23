const { createObject } = require('../../utils');

module.exports.angularMetrics = createObject([
  'USE_JEST',
  'NG_BUILD',
  'USE_HTTP_CLIENT',
  'COMPONENTS_LENGTH',
  'TEMPLATE_LENGTH',
  'SERVICE_PER_SCREEN',
  'PRODUCTION_MODE_ENABLED',
  'NG_FOR_TRACK_BY'
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

module.exports.JEST_REGEX = /^jest/;
module.exports.NG_BUILD_REGEX = /^ng build --prod/;
module.exports.HTTP_CLIENT_IMPORT = "import { HttpClient } from '@angular/common/http'";
module.exports.folderHasService = folder => folder.some(file => /.services.ts$/.test(file));
