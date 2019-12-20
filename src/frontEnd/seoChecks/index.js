const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const csvtojson = require('csvtojson');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const seoMetrics = require('./constants');

const opts = {
  output: ['html', 'csv'],
  chromeFlags: ['--headless'],
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

const getFcuValue = value => {
  const x = value * 100;
  if (x < 50) {
    return '+4 seg';
  }
  if (x < 75) {
    return '2 - 4 seg';
  }
  return '0 - 2 seg';
};

module.exports = async url => {
  const seoResults = [];
  if (url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
    opts.port = chrome.port;
    const results = await lighthouse(url, opts);
    const csv = ReportGenerator.generateReport(results.lhr, 'csv');
    const metrics = await csvtojson().fromString(csv);
    const firstCP = metrics.find(
      ({ category, title }) => category === 'Performance' && title.includes('First Contentful Paint')
    );
    seoResults.push({
      metric: seoMetrics.FIRST_CONTENTFUL_PAINT,
      description: firstCP.title,
      value: getFcuValue(firstCP.score)
    });
    const firstMP = metrics.find(
      ({ category, title }) => category === 'Performance' && title.includes('First Meaningful Paint')
    );
    seoResults.push({
      metric: seoMetrics.FIRST_MEANINGFUL_PAINT,
      description: firstMP.title,
      value: getFcuValue(firstMP.score)
    });
    lighthouseSummary.forEach(({ metric, id }) =>
      seoResults.push({
        metric,
        description: results.lhr.categories[id].title,
        value: results.lhr.categories[id].score * hundred
      })
    );
  }
  return seoResults;
};
