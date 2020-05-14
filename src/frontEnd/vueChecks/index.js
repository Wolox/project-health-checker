const fs = require('fs');
const { vueMetrics } = require('./constants');
const { checkScopedFiles, checkVueTemplate, checkVuexUse, checkBuildScript } = require('./utils');

module.exports = async testPath => {
  const vueResult = [];

  vueResult.push({
    metric: vueMetrics.USE_CLI_SERVICE,
    description: 'El proyecto usa @vue/cli-service para generar el build en producción',
    value: checkBuildScript(testPath)
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

  vueResult.push({
    metric: vueMetrics.STATE_MODULES,
    description: 'El proyecto usa modulos para separar el estado de la aplicación',
    value: fs.existsSync(`${testPath}/src/store/modules`)
  });

  console.log('✨VUE CHECKS ✨\n\n', vueResult);

  return vueResult;
};
