const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const open = require('open');
const moment = require('moment');
const { red } = require('../constants/colors');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const reportHtmlPath = `./seoReports/seoReport-${moment().format()}.html`;
const reportCsvPath = `./seoReports/seoReport-${moment().format()}.csv`;

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      const res = results.report;
      // workaround to save the report
      fs.writeFile(reportHtmlPath, res, err => {
        if (err) {
          console.log(err);
        }
      });
      const csv = ReportGenerator.generateReport(results.lhr, 'csv');
      fs.writeFile(reportCsvPath, csv, err => {
        if (err) {
          console.log(err);
        }
      });
      return chrome.kill().then(() => results.lhr);
    });
  });
}

const opts = {
  output: ['html', 'csv'],
  chromeFlags: ['--headless'],
  view: true
};

module.exports = seoLink => {
  if (seoLink) {
    return launchChromeAndRunLighthouse(seoLink, opts).then(() => open(reportHtmlPath));
  }
  return console.log(red, 'No se paso una url para checkear el seo');
};
