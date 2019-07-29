/* eslint-disable no-console */
const { find, findSync } = require('find-in-files');
const fs = require('fs');
const read = require('read-file');

const { resolveColor, calculatePercentage } = require('../utils');
const colors = require('../constants/colors');
const limits = require('../constants/limits');

let amountOfJsAppFolder = 0;

module.exports = testPath => {
  findSync('', `${testPath}/src/app`, '.js$').then(
    results => (amountOfJsAppFolder = Object.keys(results).length)
  );

  find("from 'i18next*';", `${testPath}/src/app`, '.js$').then(results => {
    const result = calculatePercentage(results, amountOfJsAppFolder);
    console.log(
      resolveColor(result, limits.i18n),
      `Porcentaje de internacionalización del total: ${result}%`
    );
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

  read(`${testPath}/package.json`, 'utf8', (err, data) => {
    const { dependencies } = JSON.parse(data);
    Object.keys(dependencies).forEach(dependency =>
      find(dependency, `${testPath}/src`, '.js$').then(results => {
        if (!Object.keys(results).length) {
          console.log(colors.red, `Dependencia no usada: ${dependency}`);
        }
      })
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
};
