/* eslint-disable no-console */
const { find, findSync } = require('find-in-files');
const read = require('read-file');

const runReactLinter = require('./linter');
const { resolveColor, calculatePercentage, sameVersion } = require('../utils');
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

  read(`${testPath}/package.json`, 'utf8', (err, data) => {
    const { dependencies } = JSON.parse(data);
    if (!sameVersion(dependencies.react, process.env.REACT_VERSION)) {
      console.log(red, 'La version de React es muy antigua');
    }
  });

  read(`${testPath}/src`, 'utf8', err => {
    const pathsOnSrc = ['app', 'config', 'constants', 'propTypes', 'redux', 'scss', 'services', 'utils', 'index'];
    
    if (err) {
      console.log(red, 'No existe un archivo de src en el root de su proyecto');
      return;
    }
    console.error(green, 'Existe un archivo de src');

    if(!err) {
      pathsOnSrc.forEach(element => {
        read(`${testPath}/src/${element}`, 'utf8', err => {
          if (err) {
            console.log(red, `No existe un archivo de ${element} dentro de src`);
            return;
          }
          console.error(green, `Existe un archivo de ${element} dentro de src`);
        });
      });
    }
  });

  try {
    runReactLinter(testPath);
  } catch (error) {
    console.log(red, `Eslint error: ${error}`);
  }
};
