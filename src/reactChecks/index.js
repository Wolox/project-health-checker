/* eslint-disable no-console */
const { find, findSync } = require('find-in-files');

const runReactLinter = require('./linter');
const { resolveColor, calculatePercentage } = require('../utils');
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
  try {
    runReactLinter(testPath);
  } catch (error) {
    console.log(red, `Eslint error: ${error}`);
  }
};
