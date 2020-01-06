const { findSync } = require('find-in-files');

const { analyzeMatches } = require('../utils');

const envMetrics = require('./constants');

module.exports = async testPath => {
  const envresult = [];
  const results = await findSync('process.env.', testPath, '.js$');
  envresult.push({
    metric: envMetrics.ENV_IS_USED,
    description: 'Se utiliza un .env en el proyecto',
    value: !!analyzeMatches(results).length
  });

  return envresult;
};
