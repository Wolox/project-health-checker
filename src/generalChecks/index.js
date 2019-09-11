/* eslint-disable no-console */
const { find, findSync } = require('find-in-files');
const fs = require('fs');
const read = require('read-file');
const yaml = require('js-yaml');
const parser = require('docker-file-parser');

const { resolveColor, calculatePercentage, assertExists } = require('../utils');
const { red, green } = require('../constants/colors');
const limits = require('../constants/limits');
const { BASE_ALIASES, DOCKERFILE_ATTRIBUTES, aliasPathRegex } = require('./constants');

let amountOfJsAppFolder = 0;
let amountOfJs = 0;

module.exports = testPath => {
  findSync('', `${testPath}/src/app`, '.js$').then(
    results => (amountOfJsAppFolder = Object.keys(results).length)
  );

  findSync('', `${testPath}/src`, '.js$').then(results => (amountOfJs = Object.keys(results).length));

  find("from 'i18next*';", `${testPath}/src/app`, '.js$').then(results => {
    const result = calculatePercentage(results, amountOfJsAppFolder);
    console.log(
      resolveColor(result, limits.i18n),
      `Porcentaje de internacionalización del total: ${result}%`
    );
  });

  find(/\n/, testPath, 'layout.js$').then(results => {
    const filtered = Object.keys(results).filter(elem => results[elem].count > limits.lines);
    console.log(
      filtered.length > limits.layoutFiles ? red : green,
      `Cantidad de layouts con mas de 150 lineas: ${filtered.length}`
    );
  });

  find(/\n/, testPath, 'index.js$').then(results => {
    const filtered = Object.keys(results).filter(elem => results[elem].count > limits.lines);
    console.log(
      filtered.length > limits.indexFiles ? red : green,
      `Cantidad de index con mas de 150 lineas: ${filtered.length}`
    );
  });

  read(`${testPath}/.github/CODEOWNERS`, 'utf8', (err, data) => {
    if (err) {
      console.log(red, 'No existe un archivo con code owners');
      return;
    }
    const codeOwners = data.split('@').length - 1;
    console.log(codeOwners > limits.codeOwners ? green : red, `Cantidad de code owners: ${codeOwners}`);
  });

  read(`${testPath}/package.json`, 'utf8', (err, data) => {
    const { dependencies } = JSON.parse(data);
    Object.keys(dependencies).forEach(dependency =>
      find(dependency, `${testPath}/src`, '.js$').then(results => {
        if (!Object.keys(results).length) {
          console.log(red, `Dependencia no usada: ${dependency}`);
        }
      })
    );
  });

  fs.access(`${testPath}/README.md`, fs.F_OK, err => {
    if (err) {
      console.log(red, 'No existe un readme');
      return;
    }
    console.error(green, 'Existe un readme');
  });

  fs.access(`${testPath}/.babelrc`, fs.F_OK, err => {
    if (err) {
      console.log(red, 'No existe un archivo .babelrc');
      return;
    }
    console.error(green, 'Existe un archivo .babelrc');

    read(`${testPath}/.babelrc`, 'utf8', (err, data) => {
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

      find("from '@.+';", `${testPath}/src`, '.js$').then(results => {
        const result = calculatePercentage(results, amountOfJs);
        console.log(
          resolveColor(result, limits.absoluteImports),
          `Porcentaje de imports absolutos del total: ${result}%`
        );
      });
    });
  });

  read(`${testPath}/Jenkinsfile`, 'utf8', err => {
    if (err) {
      console.log(red, 'No existe un Jenkinsfile');
      return;
    }
    console.error(green, 'Existe un Jenkinsfile');
  });

  read(`${testPath}/.woloxci/config.yml`, 'utf8', (err, data) => {
    if (err) {
      console.log(red, 'No existe un config.yml en .woloxci');
      return;
    }
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
  });

  read(`${testPath}/.woloxci/Dockerfile`, 'utf8', (err, data) => {
    if (err) {
      console.log(red, 'No existe un Dockerfile');
      return;
    }
    const file = parser.parse(data);
    DOCKERFILE_ATTRIBUTES.map(value => {
      const response = file.find(attr => value === attr.name);
      return assertExists(response, `la variable ${value} en Dockerfile en .woloxci`);
    });
  });

  fs.access(`${testPath}/.nvmrc`, fs.F_OK, err => {
    if (err) {
      console.log(red, 'No existe un archivo .nvmrc');
      return;
    }
    console.error(green, 'Existe un archivo .nvmrc');
  });
};
