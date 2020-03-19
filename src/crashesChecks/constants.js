const { createObject } = require('../utils');

module.exports.DEFAULT_ENVIRONMENTS = {
  PRODUCTION: ['master'],
  PRE_PRODUCTION: ['development', 'stage']
};

module.exports.crashesMetrics = createObject(['PRODUCTION_CRASHES', 'PRE_PRODUCTION_CRASHES']);
