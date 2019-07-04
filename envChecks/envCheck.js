const fs = require('fs')
const { find } = require('find-in-files')

const { analyzeMatches } = require('../utils/utils.js')

const VALID_ENVS = ['development', 'stage', 'master'];

module.exports.runEnvChecks = env => {
  find('process\.env\.', './test', '.js$').then(results =>
    console.log('Se necesita .env para correr el proyecto: ', !!analyzeMatches(results).length)
  );
  if (!VALID_ENVS.includes(env)) console.log(`Entorno '${env}' no es válido. Los entornos válidos son: '${VALID_ENVS.join(', ')}'`)
  if (!fs.existsSync(`./.env.${env}`)) console.log(`Archivo .env.${env} no existe en el root del proyecto`)
  if (!fs.existsSync('aws.js')) console.log("Archivo aws.js no existe en el root del proyecto")
};
