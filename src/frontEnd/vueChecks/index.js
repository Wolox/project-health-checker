const fs = require('fs');
const { vueMetrics, VUE_BUILD_SCRIPT_REGEX } = require('./constants');
const { checkScopedFiles, checkVueTemplate, checkVuexUse } = require('./utils');

module.exports = async testPath => {
  const vueResult = [];

  /*
    When this https://github.com/Wolox/project-health-checker/pull/55 is merged
    use the following code instead nest 2 lines:

    const { fetchJSON } = '../../utils';
    const { scripts } = fetchJSON(`${testPath}/package.json`);
  */
  const rawPackageJson = fs.readFileSync(`${testPath}/package.json`);
  const { scripts } = JSON.parse(rawPackageJson);

  vueResult.push({
    metric: vueMetrics.USE_CLI_SERVICE,
    description: 'El proyecto usa @vue/cli-service para generar el build en producción',
    value: VUE_BUILD_SCRIPT_REGEX.test(scripts.buid)
  });

  vueResult.push({
    metric: vueMetrics.SCOPED_STYLES,
    description: 'Todos los componentes deben tener scoped-styles',
    value: await checkScopedFiles(testPath)
  });

  vueResult.push({
    metric: vueMetrics.VUE_TEMPLATE,
    description: 'Los componentes son creados como SFC',
    value: await checkVueTemplate(testPath)
  });

  vueResult.push({
    metric: vueMetrics.USE_VUEX,
    description: 'El proyecto usa vuex para la creación del store',
    value: await checkVuexUse(testPath)
  });

  return vueResult;
};
