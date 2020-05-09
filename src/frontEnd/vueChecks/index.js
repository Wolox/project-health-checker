const { vueMetrics, VUE_BUILD_SCRIPT_REGEX } = require('./constants');
const fs = require('fs');

module.exports = testPath => {
  const vueResult = [];

  const rawPackageJson = fs.readFileSync(`${testPath}/package.json`);
  const { scripts } = JSON.parse(rawPackageJson);

  vueResult.push({
    metric: vueMetrics.CLI_SERVICE,
    description: 'El proyecto usa @vue/cli-service para generar el build en producción',
    value: VUE_BUILD_SCRIPT_REGEX.test(scripts.buid)
  });

  return vueResult;
};
