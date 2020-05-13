const shell = require('shelljs');
const testMetrics = require('./constants');

shell.config.silent = true;

const columnNeeded = 4;

module.exports = testPath => {
  const testResponse = [];
  const child = shell.exec(`npm run test --prefix ${testPath} -- --coverage | grep -h "All files"`);
  const percentageCoverage = child.split('|')[columnNeeded] || 0;

  testResponse.push({
    metric: testMetrics.CODE_COVERAGE,
    description: 'Porcentaje de lineas de código testeado sobre total',
    value: Number(percentageCoverage)
  });

  return testResponse;
};
