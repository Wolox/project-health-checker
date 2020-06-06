const shell = require('shelljs');
const { fetchJSON } = require('../utils');

module.exports.getLinterErrorCount = testPath => {
  // shell.exec(`npm run lint --prefix ${testPath} -- --format json -o report.json`);
  // const linterReport = fetchJSON(`${testPath}/report.json`);
  // return linterReport.reduce((errorCount, current) => errorCount + current.errorCount, 0);
  const lintResult = shell.exec(`npm run linst --prefix ${testPath} -- --format=json`);
  console.log('lintResult', lintResult);
};
