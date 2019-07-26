/* eslint-disable no-console */
require('dotenv').config();
const { find, findSync } = require('find-in-files');
const fs = require('fs');
const read = require('read-file');
const parseArgs = require('minimist');

const { resolveColor, calculatePercentage } = require('./utils/utils');
const colors = require('./constants/colors');
const limits = require('./constants/limits');
const { runEnvChecks } = require('./envChecks/envCheck');

const args = parseArgs(process.argv);

let testPath = './test';

if (args.path) {
  testPath = args.path;
} else if (args.p) {
  testPath = args.p;
}

let amountOfJs = 0;
let amountOfJsAppFolder = 0;
let amountOfActionJs = 0;
let amountOfScss = 0;

runEnvChecks(testPath);

findSync('', testPath, '.js$').then(results => (amountOfJs = Object.keys(results).length));
findSync('', testPath, 'actions.js$').then(results => (amountOfActionJs = Object.keys(results).length));
findSync('', testPath, 'styles.scss$').then(results => (amountOfScss = Object.keys(results).length));
findSync('', `${testPath}/src/app`, '.js$').then(
  results => (amountOfJsAppFolder = Object.keys(results).length)
);

find("from 'i18next*';", `${testPath}/src/app`, '.js$').then(results => {
  const result = calculatePercentage(results, amountOfJsAppFolder);
  console.log(
    resolveColor(result, limits.i18n),
    `Porcentaje de uso de internacionalización del total: ${result}%`
  );
});

find('=>', testPath, '.js$').then(results => {
  const result = calculatePercentage(results, amountOfJs);
  console.log(
    resolveColor(result, limits.arrowFunctions),
    `Porcentaje de uso de arrow functions del total: ${result}%`
  );
});

find('([A-Z][a-z]+)+', testPath, '.scss$').then(results => {
  const result = calculatePercentage(results, amountOfScss);
  console.log(
    resolveColor(limits.scss, result),
    `Porcentaje de archivos con cammel case en sass: ${result}%`
  );
});

find("from 'redux-recompose';", testPath, 'actions.js$').then(results => {
  const result = calculatePercentage(results, amountOfActionJs);
  console.log(resolveColor(result, limits.actions), `Porcentaje de actions con redux-recompose: ${result}%`);
});

find(/\n/, testPath, 'layout.js$').then(results => {
  const filtered = Object.keys(results).filter(elem => results[elem].count > limits.lines);
  console.log(
    filtered.length > limits.layoutFiles ? colors.red : colors.green,
    `Cantidad de layouts con mas de 150 lineas: ${filtered.length}`
  );
});

find(/\n/, testPath, 'index.js$').then(results => {
  const filtered = Object.keys(results).filter(elem => results[elem].count > limits.lines);
  console.log(
    filtered.length > limits.indexFiles ? colors.red : colors.green,
    `Cantidad de index con mas de 150 lineas: ${filtered.length}`
  );
});

read(`${testPath}/.github/CODEOWNERS`, 'utf8', (err, data) => {
  if (err) {
    console.log(colors.red, 'No existe un archivo con code owners');
    return;
  }
  const codeOwners = data.split('@').length - 1;
  console.log(
    codeOwners > limits.codeOwners ? colors.green : colors.red,
    `Cantidad de code owners: ${codeOwners}`
  );
});

fs.access(`${testPath}/README.md`, fs.F_OK, err => {
  if (err) {
    console.log(colors.red, 'No existe un readme');
    return;
  }
  console.error(colors.green, 'Existe un readme');
});

fs.access(`${testPath}/.babelrc`, fs.F_OK, err => {
  if (err) {
    console.log(colors.red, 'No existe un archivo .babelrc');
    return;
  }
  console.error(colors.green, 'Existe un archivo .babelrc');
});
