/* eslint-disable max-statements */
const { findSync } = require('find-in-files');
const fs = require('fs');
const read = require('read-file');
const yaml = require('js-yaml');
const parser = require('docker-file-parser');

const { calculatePercentage } = require('../utils');

const { BASE_ALIASES, DOCKERFILE_ATTRIBUTES, folderStructure, generalMetrics } = require('./constants');
const { validateJenkinsFileContent } = require('../utils/jenkinsFilesUtils');

let amountOfJs = 0;

module.exports = async (testPath, tech) => {
  const generalResult = [];

  const allResults = await findSync('', `${testPath}/src`, '.js$');
  amountOfJs = Object.keys(allResults).length;

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

  if (fs.existsSync(`${testPath}/src`)) {
    folderStructure[tech].forEach(element =>
      generalResult.push({
        metric: generalMetrics.FOLDER_STRUCTURE,
        description: `Existe un archivo ${element} dentro de src`,
        value: fs.existsSync(`${testPath}/src/${element}`)
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

    const importsResult = await findSync("from '@.+';", `${testPath}/src`, '.js$');
    const importCalculationResult = calculatePercentage(importsResult, amountOfJs);
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

  try {
    const data = read.sync(`${testPath}/Jenkinsfile`, 'utf8');
    generalResult.push({
      metric: 'Jenkinsfile',
      description: 'Existe un Jenkinsfile',
      value: true
    });
    const { woloxCiImport, checkoutConfig, woloxCiValidPath } = validateJenkinsFileContent(data, testPath);
    generalResult.push({
      metric: 'Jenkinsfile',
      description: 'Existe la importación de wolox-ci en el archivo Jenkinsfile',
      value: !!woloxCiImport
    });
    generalResult.push({
      metric: 'Jenkinsfile',
      description: 'Existe la configuración de checkout en el archivo Jenkinsfile',
      value: !!checkoutConfig
    });
    generalResult.push({
      metric: 'Jenkinsfile',
      description: 'Existe el archivo de configuración woloxCi en el archivo Jenkinsfile',
      value: !!woloxCiValidPath
    });
  } catch {
    generalResult.push({
      metric: 'Jenkinsfile',
      description: 'Existe un Jenkinsfile',
      value: false
    });
  }

  try {
    const data = read.sync(`${testPath}/.woloxci/config.yml`, 'utf8');
    const { config, steps, environment } = yaml.load(data);
    if (config) {
      const { dockerfile, project_name: projectName } = config;
      generalResult.push({
        metric: 'Woloxci',
        description: 'Existe la variable dockerfile en config de config.yml en .woloxci',
        value: !!dockerfile
      });
      generalResult.push({
        metric: 'Woloxci',
        description: 'Existe la variable project_name en config de config.yml en .woloxci',
        value: !!projectName
      });
    }
    if (steps) {
      const { lint } = steps;
      generalResult.push({
        metric: 'Woloxci',
        description: 'Existe la variable dockerfile en steps de config.yml en .woloxci',
        value: !!lint
      });
    }
    if (environment) {
      const { GIT_COMMITTER_NAME, GIT_COMMITTER_EMAIL, LANG } = environment;
      generalResult.push({
        metric: 'Config.yml',
        description: 'Existe la variable GIT_COMMITTER_NAME en environment de config.yml en .woloxci',
        value: !!GIT_COMMITTER_NAME
      });
      generalResult.push({
        metric: 'Config.yml',
        description: 'Existe la variable GIT_COMMITTER_EMAIL en environment de config.yml en .woloxci',
        value: !!GIT_COMMITTER_EMAIL
      });
      generalResult.push({
        metric: 'Config.yml',
        description: 'Existe la variable LANG en environment de config.yml en .woloxci',
        value: !!LANG
      });
    }
  } catch {
    generalResult.push({
      metric: 'Config.yml',
      description: 'Existe existe un config.yml en .woloxci',
      value: false
    });
  }

  try {
    const data = read.sync(`${testPath}/.woloxci/Dockerfile`, 'utf8');
    const file = parser.parse(data);
    DOCKERFILE_ATTRIBUTES.forEach(value => {
      const response = file.find(attr => value === attr.name);
      generalResult.push({
        metric: 'Dockerfile',
        description: `Existe la variable ${value} en Dockerfile en .woloxci`,
        value: !!response
      });
    });
  } catch {
    generalResult.push({
      metric: 'Dockerfile',
      description: 'Existe Dockerfile',
      value: false
    });
  }

  return generalResult;
};
