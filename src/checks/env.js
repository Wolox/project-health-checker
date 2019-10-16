const fs = require('fs');
const { findSync } = require('find-in-files');

const { analyzeMatches } = require('../utils/common');

const VALID_ENVS = ['.development', '.stage', '.master'];

module.exports = async testPath => {
  const envresult = [];
  VALID_ENVS.forEach(elem => {
    envresult.push({
      metric: 'ENV',
      description: `Existe un archivo.env ${elem}`,
      value: fs.existsSync(`${testPath}/.env${elem}`)
    });
  });
  const results = await findSync('process.env.', testPath, '.js$');
  envresult.push({
    metric: 'ENV',
    description: 'Se utiliza un .env en el proyecto',
    value: !!analyzeMatches(results).length
  });
  envresult.push({ metric: 'AWS', description: 'Existe aws.js', value: fs.existsSync(`${testPath}/aws.js`) });

  return envresult;
};
