const fs = require('fs');
const { find, findSync } = require('find-in-files');
const { fetchJSON, calculatePercentage } = require('../../utils');
const { limits } = require('./constants');

module.exports.checkScopedFiles = async testPath => {
  const results = await findSync('<style', `${testPath}/src`, '.vue$');
  return Object.values(results).every(({ line }) => line[0].includes('scoped'));
};

module.exports.checkVueTemplate = async testPath => {
  const badFiles = await findSync(/[Vv]ue.component\(/, `${testPath}/src`, '.js$');
  return !Object.keys(badFiles).length;
};

module.exports.checkVuexUse = async testPath => {
  const response = await find(/import [Vv]uex from 'vuex'/, `${testPath}/src/store`, 'index.js$')
    .then(results => !!Object.keys(results).length)
    .catch(() => false);

  return response;
};

module.exports.checkBuildScript = testPath => {
  const packageJson = fetchJSON(`${testPath}/package.json`);
  return /^vue-cli-service build/.test(packageJson.scripts.build);
};

module.exports.calculateI18nPercentage = async testPath => {
  const appResults = await findSync('', `${testPath}/src`, '.vue$');
  const amountOfVueAppFolder = Object.keys(appResults).length;
  const i18nResults = await findSync(/\$t\(/, `${testPath}/src`, '.vue$');

  return calculatePercentage(i18nResults, amountOfVueAppFolder, true);
};

module.exports.checkVueFilesLength = async testPath => {
  const results = await findSync(/\n/, testPath, '.vue$');
  return Object.values(results).filter(({ count }) => count > limits.maxLines).length;
};

module.exports.checkLazyRoutes = async testPath => {
  const viewsCount = fs.readdirSync(`${testPath}/src/views`).length;
  const results = await findSync('webpackChunkName', `${testPath}/src/config`, 'routes.js$');
  const linesFound = Object.values(results)[0].line;
  const routesCount = linesFound.filter(line => !line.match(/^\/\//)).length;
  return viewsCount === routesCount;
};
