const fs = require('fs');
const { vueMetrics, VUE_BUILD_SCRIPT_REGEX } = require('./constants');
const { haveVueFilesScopedStyles } = require('./utils');

module.exports = testPath => {
  const vueResult = [];

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

  return vueResult;
};
