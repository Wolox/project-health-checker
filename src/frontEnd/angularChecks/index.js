const fs = require('fs');
const { fetchJSON } = require('../../utils');
const { angularMetrics } = require('./constants');

module.exports = testPath => {
  const angularResult = [];
  const packageJson = fetchJSON(`${testPath}/package.json`);
  const testConfigFile = fs.readFileSync(`${testPath}/src/test.ts`);

  angularResult.push({
    metric: angularMetrics.PROJECT_USE_JEST,
    description: 'El proyecto usa JEST com framework de pruebas',
    value: /^jest/.test(packageJson.scripts.test) || testConfigFile.includes("import 'jest-preset-angular'")
  });

  return angularResult;
};
