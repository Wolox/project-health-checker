const shell = require('shelljs');
const fs = require('fs');
const { fetchJSON } = require('../utils');

module.exports.getLinterErrorCount = testPath => {
  shell.exec(`npm run lint --prefix ${testPath} -- --format json -o report.json`);
  if (fs.existsSync(`${testPath}/report.json`)) {
    const linterReport = fetchJSON(`${testPath}/report.json`);
    return linterReport.reduce((errorCount, current) => errorCount + current.errorCount, 0);
  }
  return null;
};
