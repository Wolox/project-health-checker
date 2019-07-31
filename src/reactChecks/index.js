/* eslint-disable no-console */
const { find, findSync } = require('find-in-files');
const read = require('read-file');

const runReactLinter = require('./linter');
const { resolveColor, calculatePercentage, sameVersion } = require('../utils');
const limits = require('../constants/limits');
const { red } = require('../constants/colors');

let amountOfActionJs = 0;

module.exports = testPath => {
  findSync('', testPath, 'actions.js$').then(results => (amountOfActionJs = Object.keys(results).length));

  find("from 'redux-recompose';", testPath, 'actions.js$').then(results => {
    const result = calculatePercentage(results, amountOfActionJs);
    console.log(
      resolveColor(result, limits.actions),
      `Porcentaje de actions con redux-recompose: ${result}%`
    );
  });

  read(`${testPath}/package.json`, 'utf8', (err, data) => {
    const { dependencies } = JSON.parse(data);
    if (!sameVersion(dependencies.react, process.env.REACT_VERSION)) {
      console.log(red, 'La version de React es muy antigua');
    }
  });

  try {
    runReactLinter(testPath);
  } catch (error) {
    console.log(red, `Eslint error: ${error}`);
  }
};
