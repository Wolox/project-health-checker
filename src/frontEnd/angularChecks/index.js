const fs = require('fs');
const { fetchJSON } = require('../../utils');
const { angularMetrics } = require('./constants');

module.exports = testPath => {
  const angularResult = [];
  const packageJson = fetchJSON(`${testPath}/package.json`);
  const testConfigFile = fs.readFileSync(`${testPath}/src/test.ts`);

  angularResult.push({
    metric: angularMetrics.USE_JEST,
    description: 'El proyecto usa JEST como framework de pruebas',
    value: /^jest/.test(packageJson.scripts.test) || testConfigFile.includes("import 'jest-preset-angular'")
  });

  angularResult.push({
    metric: angularMetrics.NG_BUILD,
    description: 'El proyecto use ng para generar el build de producción',
    value: /^ng build --prod/.test(packageJson.scripts.build)
  });

  return angularResult;
};
