const { findSync } = require('find-in-files');

const { resolveColor, calculatePercentage } = require('../utils');
const limits = require('../constants/limits');

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

  return techResult;
};
