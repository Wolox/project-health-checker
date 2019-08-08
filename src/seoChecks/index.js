const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const open = require('open');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      const res = results.report;

      // workaround to save the report
      fs.writeFile('ceoReport.html', res, err => {
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
module.exports = seoLink =>
  launchChromeAndRunLighthouse(seoLink, opts).then(() => {
    (async () => {
      await open('./ceoReport.html');
    })();
  });
