/* eslint-disable no-console */
const fs = require('fs');
const { find } = require('find-in-files');
const colors = require('../constants/colors');

const { analyzeMatches } = require('../utils/utils.js');

const VALID_ENVS = ['.development', '.stage', '.master'];

module.exports.runEnvChecks = () => {
  VALID_ENVS.forEach(elem =>
    fs.access(`test/.env${elem}`, fs.F_OK, err => {
      if (err) {
        console.log(colors.red, `No existe un archivo .env${elem}`);
      } else {
        console.log(colors.green, `Existe un archivo .env${elem}`);
      }
    })
  );
  find('process.env.', './test', '.js$').then(results => {
    if (analyzeMatches(results).length) {
      console.log(colors.green, 'Se utiliza un .env en el proyecto');
    } else {
      console.log(colors.red, 'No se esta utilizando ningun .env en el proyecto');
    }
  });
  if (!fs.existsSync('test/aws.js')) {
    console.log(colors.red, 'No existe aws.js en el root del proyecto');
  }
};
