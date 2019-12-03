const { findSync } = require('find-in-files');

const { calculatePercentage } = require('../../utils');

const reactMetrics = require('./constants');

let amountOfActionJs = 0;

module.exports = async testPath => {
  const techResult = [];
  const actionResults = await findSync('', testPath, 'actions.js$');
  amountOfActionJs = Object.keys(actionResults).length;

  const results = await findSync("from 'redux-recompose';", testPath, 'actions.js$');
  const result = calculatePercentage(results, amountOfActionJs);
  techResult.push({
    metric: reactMetrics.REDUX_RECOMPOSE,
    description: 'Porcentaje de actions con redux-recompose',
    value: result
  });

  return techResult;
};