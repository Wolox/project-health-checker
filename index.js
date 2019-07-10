/* eslint-disable no-console */
require('dotenv').config();
const { find } = require('find-in-files');

const { analyzeMatches } = require('./utils/utils');

let amountOfJs = 0;
const percentage = 100;

find('', './test', '.js$').then(results => (amountOfJs = Object.keys(results).length));

find("from 'i18next*';", './test', '.js$').then(results =>
  console.log(
    `Porcentaje de uso de internacionalización del total: ${(
      analyzeMatches(results).length / amountOfJs * // eslint-disable-line prettier/prettier
      percentage
    ).toFixed(2)}%`
  )
);

find('((=> {)|() =>)', './test', '.js$').then(results =>
  console.log(
    `Porcentaje de uso de arrow functions del total: ${(
      analyzeMatches(results).length / amountOfJs * // eslint-disable-line prettier/prettier
      percentage
    ).toFixed(2)}%`
  )
);

find('([A-Z][a-z]+)+', './test', '.scss$').then(results =>
  console.log('Cantidad de archivos con cammel case en sass: ', Object.keys(results).length)
);

const readme = new File('./test/README.md');
if (readme.exists()) {
  console.log('Existe un readme');
} else {
  console.log('No existe un readme');
}
