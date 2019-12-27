const shell = require('shelljs');
const testMetrics = require('./constants');

shell.config.silent = true;

let percentageCoverage = 0;
const columnNeeded = 4;

module.exports = testPath => {
  const testResponse = [];
  const child = shell.exec(`npm test --prefix ${testPath}`);
  const outputByLine = child.stdout.toString().split('\n');
  const allFilesLine = outputByLine.find(
    item =>
      item
        .split(/\|/)[0]
        .trim()
        .localeCompare('All files') === 0
  );
  if (allFilesLine) {
    percentageCoverage = parseFloat(allFilesLine.split(/\|/)[columnNeeded].trim());
  }
  testResponse.push({
    metric: testMetrics.CODE_COVERAGE,
    description: 'Porcentaje de lineas de código testeado sobre total',
    value: percentageCoverage
  });

  return testResponse;
};
