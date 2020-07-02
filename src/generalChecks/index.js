const fs = require('fs');
const path = require('path');
const { findSync } = require('find-in-files');
const read = require('read-file');

const { calculatePercentage } = require('../utils');

const { BASE_ALIASES, folderStructure, generalMetrics, rootPath } = require('./constants');

module.exports = async (testPath, tech) => {
  const generalResult = [];

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

  if (fs.existsSync(path.join(testPath, rootPath[tech]))) {
    folderStructure[tech].forEach(element =>
      generalResult.push({
        metric: generalMetrics.FOLDER_STRUCTURE,
        description: `Existe un archivo ${element} dentro del root del proyecto`,
        value: fs.existsSync(path.join(testPath, rootPath[tech], element))
      })
    );
  } else {
    generalResult.push({
      metric: generalMetrics.FOLDER_STRUCTURE,
      description: `Existe un archivo de ${rootPath[tech]} en el root de su proyecto`,
      value: false
    });
  }

  if (tech !== 'angular') {
    generalResult.push({
      metric: generalMetrics.BABEL,
      description: 'Existe un archivo .babelrc',
      value: fs.existsSync(`${testPath}/.babelrc.js`)
    });

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
    } catch {
      generalResult.push({
        metric: generalMetrics.BABEL_IMPORTS,
        description: 'El archivo .babelrc contiene el plugin "module-resolver',
        value: false
      });
    }

    let absoluteImportsPercentage = null;

    try {
      const allResults = await findSync('', `${testPath}/${rootPath[tech]}`, /.(js|ts)$/);
      const amountOfScriptFiles = Object.keys(allResults).length;
      const importsResult = await findSync("from '@.+';", `${testPath}/${rootPath[tech]}`, /.(js|ts)$/);
      absoluteImportsPercentage = calculatePercentage(importsResult, amountOfScriptFiles);
    } catch {
      absoluteImportsPercentage = 0;
    }

    generalResult.push({
      metric: generalMetrics.ABSOLUTE_IMPORTS_PERCENTAGE,
      description: 'Porcentaje de imports absolutos del total',
      value: absoluteImportsPercentage
    });
  }

  return generalResult;
};
