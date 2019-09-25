/* eslint-disable no-console */
const { findSync } = require('find-in-files');
const read = require('read-file');

const runReactLinter = require('./linter');
const { resolveColor, calculatePercentage, sameVersion } = require('../utils');
const limits = require('../constants/limits');
const { red } = require('../constants/colors');

let amountOfActionJs = 0;

module.exports = async testPath => {
  const techResult = [];
  const actionResults = await findSync('', testPath, 'actions.js$');
  amountOfActionJs = Object.keys(actionResults).length;

  const results = await findSync("from 'redux-recompose';", testPath, 'actions.js$');
  const result = calculatePercentage(results, amountOfActionJs);
  console.log(resolveColor(result, limits.actions), `Porcentaje de actions con redux-recompose: ${result}%`);
  techResult.push({
    metric: 'Redux Recompose',
    description: 'Porcentaje de actions con redux-recompose',
    value: result
  });

  try {
    const data = read.sync(`${testPath}/package.json`, 'utf8');
    const { dependencies } = JSON.parse(data);
    if (!sameVersion(dependencies.react, process.env.REACT_VERSION)) {
      console.log(red, 'La version de React es muy antigua');
    }
  } catch {}

  try {
    runReactLinter(testPath);
  } catch (error) {
    console.log(red, `Eslint error: ${error}`);
  }

  return techResult;
};
