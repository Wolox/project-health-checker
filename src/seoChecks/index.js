const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const open = require('open');
const moment = require('moment');
const { red } = require('../constants/colors');

const reportPath = `./ceoReports/ceoReport-${moment().format()}.html`;

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      const res = results.report;

      // workaround to save the report
      fs.writeFile(reportPath, res, err => {
        if (err) {
          console.log(err);
        }
      });
      return chrome.kill().then(() => results.lhr);
    });
  });
}

const opts = {
  output: 'html',
  chromeFlags: ['--headless'],
  view: true
};

module.exports = seoLink => {
  if (typeof seoLink === 'string') {
    return launchChromeAndRunLighthouse(seoLink, opts).then(() => {
      (async () => {
        await open(reportPath);
      })();
    });
  }
  return console.log(red, 'No se paso una url para checkear el ceo');
};
