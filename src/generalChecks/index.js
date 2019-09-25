/* eslint-disable max-statements, complexity */
/* eslint-disable no-console */
const { findSync } = require('find-in-files');
const fs = require('fs');
const read = require('read-file');
const yaml = require('js-yaml');
const parser = require('docker-file-parser');
const npmCheck = require('npm-check');

const { resolveColor, calculatePercentage, assertExists } = require('../utils');
const { red, green } = require('../constants/colors');
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
  console.log(resolveColor(result, limits.i18n), `Porcentaje de internacionalización del total: ${result}%`);
  generalResult.push({ metric: 'i18n', description: 'Porcentaje de internacionalización', value: result });

  const layoutResults = await findSync(/\n/, testPath, 'layout.js$');
  const filteredLayout = Object.keys(layoutResults).filter(elem => layoutResults[elem].count > limits.lines);
  console.log(
    filteredLayout.length > limits.layoutFiles ? red : green,
    `Cantidad de layouts con mas de 150 lineas: ${filteredLayout.length}`
  );
  generalResult.push({
    metric: 'Layout lines',
    description: 'Cantidad de layouts con mas de 150 lineas',
    value: filteredLayout.length
  });

  const indexResults = await findSync(/\n/, testPath, 'index.js$');
  const filteredIndex = Object.keys(indexResults).filter(elem => indexResults[elem].count > limits.lines);
  console.log(
    filteredIndex.length > limits.indexFiles ? red : green,
    `Cantidad de index con mas de 150 lineas: ${filteredIndex.length}`
  );
  generalResult.push({
    metric: 'Lineas de Index',
    description: 'Cantidad de index con mas de 150 lineas',
    value: filteredIndex.length
  });

  try {
    const data = read.sync(`${testPath}/.github/CODEOWNERS`, 'utf8');
    const codeOwners = data.split('@').length - 1;
    console.log(codeOwners > limits.codeOwners ? green : red, `Cantidad de code owners: ${codeOwners}`);
    generalResult.push({
      metric: 'Code Owners',
      description: 'Cantidad de code owners',
      value: codeOwners
    });
  } catch {
    console.log(red, 'No existe un archivo con code owners');
    generalResult.push({
      metric: 'ERROR: Code Owners',
      description: 'Existe un archivo con code owners',
      value: 'NO'
    });
  }

  npmCheck({ cwd: testPath }).then(currentState => {
    const packages = currentState.get('packages');
    packages.forEach(dependency => {
      const { moduleName, latest, packageJson, unused, bump } = dependency;
      if (unused) {
        console.log(red, `Dependencia no usada: ${moduleName}`);
      } else if (bump && bump !== 'patch') {
        console.log(
          red,
          `Dependencia no actualizada: ${moduleName}, Version: packageJson: ${packageJson} -> ultima ${latest} `
        );
      }
    });
  });

  try {
    fs.accessSync(`${testPath}/README.md`, fs.F_OK);
    console.error(green, 'Existe un readme');
    generalResult.push({
      metric: 'Readme',
      description: 'Existe un readme',
      value: 'SI'
    });
  } catch {
    console.log(red, 'No existe un readme');
    generalResult.push({
      metric: 'Readme',
      description: 'Existe un readme',
      value: 'NO'
    });
  }

  try {
    fs.accessSync(`${testPath}/.babelrc`, fs.F_OK);
    console.error(green, 'Existe un archivo .babelrc');
    generalResult.push({
      metric: 'Babel',
      description: 'Existe un archivo .babelrc',
      value: 'SI'
    });
  } catch {
    console.log(red, 'No existe un archivo .babelrc');
    generalResult.push({
      metric: 'Babel',
      description: 'Existe un archivo .babelrc',
      value: 'NO'
    });
  }

  try {
    const data = read.sync(`${testPath}/.babelrc`, 'utf8');
    const moduleResolver = JSON.parse(data).plugins.filter(
      plugin => Array.isArray(plugin) && plugin[0] === 'module-resolver'
    );
    if (!moduleResolver.length) {
      console.log(red, 'El archivo .babelrc no contiene el plugin "module-resolver"');
      return;
    }
    const aliases = moduleResolver[0][1].alias;
    const isBaseAlias = alias =>
      Object.keys(aliases).includes(alias) || console.log(red, `Falta absolute import para: ${alias}`);
    const validPath = alias =>
      aliasPathRegex(alias).test(aliases[alias]) ||
      console.log(red, `El import absoluto de "${alias}" no está configurado correctamente`);
    if (
      BASE_ALIASES.reduce(
        (accumulator, currentAlias) => isBaseAlias(currentAlias) && validPath(currentAlias) && accumulator
      )
    ) {
      console.log(green, 'Imports absolutos configurados');
    }

    const importsResult = await findSync("from '@.+';", `${testPath}/src`, '.js$');
    const importCalculationResult = calculatePercentage(importsResult, amountOfJs);
    console.log(
      resolveColor(importCalculationResult, limits.absoluteImports),
      `Porcentaje de imports absolutos del total: ${importCalculationResult}%`
    );
  } catch {}

  try {
    const data = read.sync(`${testPath}/Jenkinsfile`, 'utf8');
    console.error(green, 'Existe un Jenkinsfile');
    const { woloxCiImport, checkoutConfig, woloxCiValidPath } = validateJenkinsFileContent(data, testPath);
    assertExists(woloxCiImport, 'la importación de wolox-ci en el archivo Jenkinsfile');
    assertExists(checkoutConfig, 'la configuración de checkout en el archivo Jenkinsfile');
    assertExists(woloxCiValidPath, 'el archivo de configuración woloxCi en el archivo Jenkinsfile');
  } catch {
    console.log(red, 'No existe un Jenkinsfile');
  }

  try {
    const data = read.sync(`${testPath}/.woloxci/config.yml`, 'utf8');
    const { config, steps, environment } = yaml.load(data);
    if (config) {
      const { dockerfile, project_name } = config;
      assertExists(dockerfile, 'la variable dockerfile en config de config.yml en .woloxci');
      assertExists(project_name, 'la variable project_name en config de config.yml en .woloxci');
    }
    if (steps) {
      const { lint } = steps;
      assertExists(lint, 'la variable dockerfile en steps de config.yml en .woloxci');
    }
    if (environment) {
      const { GIT_COMMITTER_NAME, GIT_COMMITTER_EMAIL, LANG } = environment;
      assertExists(
        GIT_COMMITTER_NAME,
        'la variable GIT_COMMITTER_NAME en environment de config.yml en .woloxci'
      );
      assertExists(
        GIT_COMMITTER_EMAIL,
        'la variable GIT_COMMITTER_EMAIL en environment de config.yml en .woloxci'
      );
      assertExists(LANG, 'la variable LANG en environment de config.yml en .woloxci');
    }
  } catch {
    console.log(red, 'No existe un config.yml en .woloxci');
  }

  try {
    const data = read.sync(`${testPath}/.woloxci/Dockerfile`, 'utf8');
    const file = parser.parse(data);
    DOCKERFILE_ATTRIBUTES.map(value => {
      const response = file.find(attr => value === attr.name);
      return assertExists(response, `la variable ${value} en Dockerfile en .woloxci`);
    });
  } catch {
    console.log(red, 'No existe un Dockerfile');
  }

  return generalResult;
};
