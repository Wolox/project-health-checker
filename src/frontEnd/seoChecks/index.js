const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const csvtojson = require('csvtojson');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const seoMetrics = require('./constants');

const opts = {
  output: ['html', 'csv'],
  chromeFlags: ['--headless', '--no-sandbox'],
  view: true
};

const hundred = 100;

const lighthouseSummary = [
  { metric: seoMetrics.LIGHTHOUSE_ACCESIBILITY_OVERALL, id: 'accessibility' },
  { metric: seoMetrics.LIGHTHOUSE_SEO_OVERALL, id: 'seo' },
  { metric: seoMetrics.LIGHTHOUSE_PWA_OVERALL, id: 'performance' },
  { metric: seoMetrics.LIGHTHOUSE_PERFORMANCE_OVERALL, id: 'best-practices' },
  { metric: seoMetrics.LIGHTHOUSE_BEST_PRACTICES_OVERALL, id: 'pwa' }
];

module.exports = async url => {
  const seoResults = [];
  if (url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
    opts.port = chrome.port;
    const results = await lighthouse(url, opts);
    const csv = ReportGenerator.generateReport(results.lhr, 'csv');
    const metrics = await csvtojson().fromString(csv);
    const firstMeaningfulPaint = metrics.find(({ name }) => name === 'first-meaningful-paint');
    const firstContentfulPaint = metrics.find(({ name }) => name === 'first-contentful-paint');

    seoResults.push({
      metric: seoMetrics.FIRST_CONTENTFUL_PAINT,
      description: firstContentfulPaint.title,
      value: firstContentfulPaint.score * hundred
    });
    seoResults.push({
      metric: seoMetrics.LOAD_TIME,
      description: firstMeaningfulPaint.title,
      value: firstMeaningfulPaint.score * hundred
    });
    lighthouseSummary.forEach(({ metric, id }) =>
      seoResults.push({
        metric,
        description: results.lhr.categories[id].title,
        value: results.lhr.categories[id].score * hundred
      })
    );

    chrome.kill();
  }
  return seoResults;
};
