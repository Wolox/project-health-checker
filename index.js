/* eslint-disable no-console */
require('dotenv').config();
const { find, findSync } = require('find-in-files');
const fs = require('fs');

const { resolveColor, calculatePercentage } = require('./utils/utils');
const colors = require('./constants/colors');
const limits = require('./constants/limits');
const { runEnvChecks } = require('./envChecks/envCheck');

let amountOfJs = 0;
let amountOfActionJs = 0;
let amountOfScss = 0;

runEnvChecks();

findSync('', './test', '.js$').then(results => (amountOfJs = Object.keys(results).length));
findSync('', './test', 'actions.js$').then(results => (amountOfActionJs = Object.keys(results).length));
findSync('', './test', 'styles.scss$').then(results => (amountOfScss = Object.keys(results).length));

find("from 'i18next*';", './test', '.js$').then(results => {
  const result = calculatePercentage(results, amountOfJs);
  console.log(
    resolveColor(result, limits.i18n),
    `Porcentaje de uso de internacionalización del total: ${result}%`
  );
});

find('=>', './test', '.js$').then(results => {
  const result = calculatePercentage(results, amountOfJs);
  console.log(
    resolveColor(result, limits.arrowFunctions),
    `Porcentaje de uso de arrow functions del total: ${result}%`
  );
});

find('([A-Z][a-z]+)+', './test', '.scss$').then(results => {
  const result = calculatePercentage(results, amountOfScss);
  console.log(
    resolveColor(limits.scss, result),
    `Porcentaje de archivos con cammel case en sass: ${result}%`
  );
});

find("from 'redux-recompose';", './test', 'actions.js$').then(results => {
  const result = calculatePercentage(results, amountOfActionJs);
  console.log(resolveColor(result, limits.actions), `Porcentaje de actions con redux-recompose: ${result}%`);
});

fs.access('./test/README.md', fs.F_OK, err => {
  if (err) {
    console.log(colors.red, 'No existe un readme');
    return;
  }
  console.error(colors.green, 'Existe un readme');
});

fs.access('./test/.babelrc', fs.F_OK, err => {
  if (err) {
    console.log(colors.red, 'No existe un archivo .babelrc');
    return;
  }
  console.error(colors.green, 'Existe un archivo .babelrc');
});
