/* eslint-disable max-statements */
const { findSync } = require('find-in-files');
const fs = require('fs');
const read = require('read-file');
const yaml = require('js-yaml');
const parser = require('docker-file-parser');
const npmCheck = require('npm-check');

const { calculatePercentage } = require('../utils');
const limits = require('../constants/limits');
const { BASE_ALIASES, DOCKERFILE_ATTRIBUTES, aliasPathRegex } = require('./constants');
const { validateJenkinsFileContent } = require('../utils/jenkinsFilesUtils');

let amountOfJsAppFolder = 0;
let amountOfJs = 0;

module.exports = async testPath => {
  const generalResult = [];
  const appResults = await findSync('', `${testPath}/src/app`, '.js$');
  amountOfJsAppFolder = Object.keys(appResults).length;

  const allResults = await findSync('', `${testPath}/src`, '.js$');
  amountOfJs = Object.keys(allResults).length;

  const i18nResults = await findSync("from 'i18next*';", `${testPath}/src/app`, '.js$');
  const result = calculatePercentage(i18nResults, amountOfJsAppFolder);
  generalResult.push({ metric: 'i18n', description: 'Porcentaje de internacionalización', value: result });

  const layoutResults = await findSync(/\n/, testPath, 'layout.js$');
  const filteredLayout = Object.keys(layoutResults).filter(elem => layoutResults[elem].count > limits.lines);
  generalResult.push({
    metric: 'Layout lines',
    description: 'Cantidad de layouts con mas de 150 lineas',
    value: filteredLayout.length
  });

  const indexResults = await findSync(/\n/, testPath, 'index.js$');
  const filteredIndex = Object.keys(indexResults).filter(elem => indexResults[elem].count > limits.lines);
  generalResult.push({
    metric: 'Lineas de Index',
    description: 'Cantidad de index con mas de 150 lineas',
    value: filteredIndex.length
  });

  try {
    const data = read.sync(`${testPath}/.github/CODEOWNERS`, 'utf8');
    const codeOwners = data.split('@').length - 1;
    generalResult.push({
      metric: 'Code Owners',
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

  const currentState = await npmCheck({ cwd: testPath });
  const packages = currentState.get('packages');
  packages.forEach(dependency => {
    const { moduleName, latest, packageJson, unused, bump } = dependency;
    if (unused) {
      generalResult.push({
        metric: 'DEPENDENCIAS',
        description: 'Dependencia no usada',
        value: moduleName
      });
    } else if (bump && bump !== 'patch') {
      generalResult.push({
        metric: 'DEPENDENCIAS',
        description: 'Dependencia no actualizada',
        value: `${moduleName} Version: packageJson: ${packageJson} -> ultima ${latest}`
      });
    }
  });

  generalResult.push({
    metric: 'Readme',
    description: 'Existe un readme',
    value: fs.existsSync(`${testPath}/README.md`)
  });

  generalResult.push({
    metric: 'Babel',
    description: 'Existe un archivo .babelrc',
    value: fs.existsSync(`${testPath}/.babelrc.js`)
  });

  try {
    const data = require(`${testPath}/.babelrc.js`);
    const moduleResolver = data.plugins.filter(
      plugin => Array.isArray(plugin) && plugin[0] === 'module-resolver'
    );
    const aliases = moduleResolver[0][1].alias;
    const isBaseAlias = alias => {
      if (!Object.keys(aliases).includes(alias)) {
        generalResult.push({
          metric: 'Import',
          description: 'Falta absolute import para',
          value: alias
        });
      }
    };
    const validPath = alias => {
      if (!aliasPathRegex(alias).test(aliases[alias])) {
        generalResult.push({
          metric: 'Import',
          description: 'El import absoluto no está configurado correctamente',
          value: alias
        });
      }
    };

    if (
      BASE_ALIASES.reduce(
        (accumulator, currentAlias) => isBaseAlias(currentAlias) && validPath(currentAlias) && accumulator
      )
    ) {
      generalResult.push({
        metric: 'Import',
        description: 'Todos los imports absolutos estan configurados correctamente',
        value: true
      });
    }

    const importsResult = await findSync("from '@.+';", `${testPath}/src`, '.js$');
    const importCalculationResult = calculatePercentage(importsResult, amountOfJs);
    generalResult.push({
      metric: 'Import',
      description: 'Porcentaje de imports absolutos del total',
      value: importCalculationResult
    });
  } catch {
    generalResult.push({
      metric: 'Babel',
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
