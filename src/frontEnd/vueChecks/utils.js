const { find, findSync } = require('find-in-files');
const { fetchJSON } = require('../../utils');

/*
  ⚠️ scoped-style validation gonna be ommited when open tag is multi-line. For example:
    <style
      lang="scss"
      scoped
    >
      ...
    </style>
*/

module.exports.checkScopedFiles = async testPath => {
  const results = await findSync('<style', `${testPath}/src`, '.vue$');
  return Object.values(results).every(({ line }) => line[0].includes('scoped'));
};

module.exports.checkVueTemplate = async testPath => {
  const badFiles = await findSync(/[Vv]ue.component\(/, `${testPath}/src`, '.js$');
  return !Object.keys(badFiles).length;
};

module.exports.checkVuexUse = async testPath => {
  const response = await find(/^import [Vv]uex from 'vuex'/, `${testPath}/src/store`, 'index.js$')
    .then(results => console.log('Vuex results', results) || !!Object.keys(results).length)
    .catch(() => false);

  return response;
};

module.exports.checkBuildScript = testPath => {
  const packageJson = fetchJSON(`${testPath}/package.json`);
  return /^vue-cli-service build/.test(packageJson.scripts.build);
};
