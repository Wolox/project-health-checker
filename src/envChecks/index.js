const fs = require('fs');
const { findSync } = require('find-in-files');

const { analyzeMatches } = require('../utils');

const envMetrics = require('./constants');

module.exports = async (testPath, techChecks) => {
  const envresult = [];
  let exitsEnvFile = false;

  if (techChecks === 'angular') {
    exitsEnvFile = fs.existsSync(`${testPath}/src/environments/environment.ts`);
  } else {
    const results = await findSync('process.env.', testPath, '.js$');
    exitsEnvFile = !!analyzeMatches(results).length;
  }

  envresult.push({
    metric: envMetrics.ENV_IS_USED,
    description: 'Se utiliza un .env en el proyecto',
    value: await exitsEnvFile
  });

  return envresult;
};
