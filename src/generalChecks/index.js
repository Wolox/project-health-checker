const { findSync } = require('find-in-files');
const fs = require('fs');
const read = require('read-file');

const { calculatePercentage } = require('../utils');

const { BASE_ALIASES, folderStructure, generalMetrics, rootPath } = require('./constants');

let amountOfScriptFiles = 0;

module.exports = async (testPath, tech) => {
  const generalResult = [];

  const allResults = await findSync('', `${testPath}/${rootPath[tech]}`, /.(js|ts)$/);
  amountOfScriptFiles = Object.keys(allResults).length;

  try {
    const data = read.sync(`${testPath}/.github/CODEOWNERS`, 'utf8');
    const codeOwners = data.split('@').length - 1;
    generalResult.push({
      metric: generalMetrics.CODE_OWNERS,
      description: 'Cantidad de code owners',
      value: codeOwners
    });
  } catch {
    generalResult.push({
      metric: 'Code Owners',
      description: 'Existe un archivo con code owners',
      value: false
    });
  }

  generalResult.push({
    metric: generalMetrics.README,
    description: 'Existe un readme',
    value: fs.existsSync(`${testPath}/README.md`)
  });

  generalResult.push({
    metric: generalMetrics.BABEL,
    description: 'Existe un archivo .babelrc',
    value: fs.existsSync(`${testPath}/.babelrc.js`)
  });

  if (fs.existsSync(`${testPath}/${rootPath[tech]}`)) {
    folderStructure[tech].forEach(element =>
      generalResult.push({
        metric: generalMetrics.FOLDER_STRUCTURE,
        description: `Existe un archivo ${element} dentro del root del proyecto`,
        value: fs.existsSync(`${testPath}/${rootPath[tech]}/${element}`)
      })
    );
  } else {
    generalResult.push({
      metric: generalMetrics.FOLDER_STRUCTURE,
      description: 'Existe un archivo de src en el root de su proyecto',
      value: false
    });
  }

  try {
    const data = require(`../../${testPath}/.babelrc.js`);
    const aliases = data.plugins.filter(
      plugin => Array.isArray(plugin) && plugin[0] === 'module-resolver'
    )[0][1].alias;
    BASE_ALIASES.forEach(alias =>
      generalResult.push({
        metric: generalMetrics.BABEL_IMPORTS,
        description: `Existe import con alias para ${alias}`,
        value: Object.keys(aliases).includes(alias)
      })
    );

    const importsResult = await findSync("from '@.+';", `${testPath}/${rootPath[tech]}`, /.(js|ts)$/);
    const importCalculationResult = calculatePercentage(importsResult, amountOfScriptFiles);
    generalResult.push({
      metric: 'Import',
      description: 'Porcentaje de imports absolutos del total',
      value: importCalculationResult
    });
  } catch {
    generalResult.push({
      metric: generalMetrics.BABEL_IMPORTS,
      description: 'El archivo .babelrc contiene el plugin "module-resolver',
      value: false
    });
  }

  console.log('Genral Results', generalResult);

  return generalResult;
};
