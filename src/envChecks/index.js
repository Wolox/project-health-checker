/* eslint-disable no-console */
const fs = require('fs');
const { findSync } = require('find-in-files');
const { red, green } = require('../constants/colors');

const { analyzeMatches } = require('../utils');

const VALID_ENVS = ['.development', '.stage', '.master'];

module.exports = async testPath => {
  const envresult = [];
  VALID_ENVS.forEach(elem => {
    try {
      fs.accessSync(`${testPath}/.env${elem}`, fs.F_OK);
      console.log(green, `Existe un archivo .env${elem}`);
      envresult.push({ metric: 'ENV', description: `Existe un archivo.env ${elem}`, value: 'SI' });
    } catch {
      console.log(red, `No existe un archivo .env${elem}`);
      envresult.push({ metric: 'ENV', description: `Existe un archivo.env ${elem}`, value: 'NO' });
    }
  });
  const results = await findSync('process.env.', testPath, '.js$');
  if (analyzeMatches(results).length) {
    console.log(green, 'Se utiliza un .env en el proyecto');
    envresult.push({ metric: 'ENV', description: 'Se utiliza un .env en el proyecto', value: 'SI' });
  } else {
    console.log(red, 'No se esta utilizando ningun .env en el proyecto');
    envresult.push({ metric: 'ENV', description: 'Se utiliza un .env en el proyecto', value: 'NO' });
  }
  if (fs.existsSync(`${testPath}/aws.js`)) {
    envresult.push({ metric: 'AWS', description: 'Existe aws.js', value: 'SI' });
  } else {
    console.log(red, 'No existe aws.js en el root del proyecto');
    envresult.push({ metric: 'AWS', description: 'Existe aws.js', value: 'NO' });
  }

  return envresult;
};
