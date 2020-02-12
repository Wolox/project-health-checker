const { findSync } = require('find-in-files');

const { calculatePercentage } = require('../../utils');
const { reactMetrics, limits } = require('./constants');

let amountOfActionJs = 0;
let amountOfJsAppFolder = 0;

module.exports = async testPath => {
  const reactResult = [];
  const appResults = await findSync('', `${testPath}/src/app`, '.js$');
  const actionResults = await findSync('', testPath, 'actions.js$');

  amountOfActionJs = Object.keys(actionResults).length;
  amountOfJsAppFolder = Object.keys(appResults).length;

  const results = await findSync("from 'redux-recompose';", testPath, 'actions.js$');
  const result = calculatePercentage(results, amountOfActionJs);
  reactResult.push({
    metric: reactMetrics.REDUX_RECOMPOSE,
    description: 'Porcentaje de actions con redux-recompose',
    value: result
  });

  const i18nResults = await findSync("from 'i18next*';", `${testPath}/src/app`, '.js$');
  const i18nPercentage = calculatePercentage(i18nResults, amountOfJsAppFolder);

  reactResult.push({
    metric: reactMetrics.I18N,
    description: 'Porcentaje de internacionalización',
    value: i18nPercentage
  });

  const layoutResults = await findSync(/\n/, testPath, 'layout.js$');
  const filteredLayout = Object.keys(layoutResults).filter(elem => layoutResults[elem].count > limits.lines);

  reactResult.push({
    metric: reactMetrics.LAYOUT_LINES,
    description: 'Cantidad de layouts con mas de 150 lineas',
    value: filteredLayout.length
  });

  const indexResults = await findSync(/\n/, testPath, 'index.js$');
  const filteredIndex = Object.keys(indexResults).filter(elem => indexResults[elem].count > limits.lines);

  reactResult.push({
    metric: reactMetrics.INDEX_LINES,
    description: 'Cantidad de index con mas de 150 lineas',
    value: filteredIndex.length
  });

  return reactResult;
};
