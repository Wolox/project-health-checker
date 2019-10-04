const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const csvtojson = require('csvtojson');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const opts = {
  output: ['html', 'csv'],
  chromeFlags: ['--headless'],
  view: true
};

module.exports = async url => {
  const seoResults = [];
  if (url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
    opts.port = chrome.port;
    const results = await lighthouse(url, opts);
    const csv = ReportGenerator.generateReport(results.lhr, 'csv');
    const metrics = await csvtojson().fromString(csv);
    metrics.forEach(({ category, title, type, score }) =>
      seoResults.push({ metric: `LightHouse-${category}`, description: `${title} - ${type}`, value: score })
    );
  }
  return seoResults;
};
