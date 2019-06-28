require('dotenv').config();
const { find } = require('find-in-files');

const { analyzeMatches } = require('./utils/utils')
const { requestChangesPercentage } = require('./gitChecks/services/requestChangesPercentaje');
const { runEnvChecks } = require('./envChecks/envCheck')

let amountOfJs;

find('', './test', '.js$').then(results =>
  amountOfJs = Object.keys(results).length
);

find("from 'i18next*';", './test', '.js$').then(results =>
  console.log(
    `Porcentaje de uso de internacionalización del total: ${(analyzeMatches(results).length / amountOfJs * 100).toFixed(2)}%`
  )
);

find('((=> {)|(\) =>)', './test', '.js$').then(results =>
  console.log(
    `Porcentaje de uso de arrow functions del total: ${(analyzeMatches(results).length / amountOfJs * 100).toFixed(2)}%`
  )
);

find('([A-Z][a-z]+)+', './test', '.scss$').then(results =>
  console.log('Cantidad de archivos con cammel case en sass: ', Object.keys(results).length)
);
