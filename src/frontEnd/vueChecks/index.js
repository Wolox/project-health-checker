const fs = require('fs');
const { vueMetrics, VUE_BUILD_SCRIPT_REGEX } = require('./constants');
const { haveVueFilesScopedStyles, areComponentsInVueTemplate } = require('./utils');

module.exports = testPath => {
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
    description: 'SFC que no estén al nivel de app deben estar scoped',
    value: haveVueFilesScopedStyles(testPath)
  });

  vueResult.push({
    metric: vueMetrics.ONLY_VUE_TEMPLATE,
    description: 'Components are defined defined with Vue template',
    value: areComponentsInVueTemplate(testPath)
  });

  return vueResult;
};
