const fs = require('fs');
const { findSync } = require('find-in-files');

const { analyzeMatches } = require('../utils');

const envMetrics = require('./constants');

module.exports = async (testPath, techChecks) => {
  const envresult = [];

  const checkEnvFile = async () => {
    if (techChecks === 'angular') {
      return fs.existsSync(`${testPath}/src/environments/environment.ts`);
    }
    const results = await findSync('process.env.', testPath, '.js$');
    return !!analyzeMatches(results).length;
  };

  envresult.push({
    metric: envMetrics.ENV_IS_USED,
    description: 'Se utiliza un .env en el proyecto',
    value: await checkEnvFile(testPath, techChecks)
  });

  return envresult;
};
