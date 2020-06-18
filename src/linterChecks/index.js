const { eslintMetrics, eslintTechConfig } = require('./constants');
const { getLinterErrorCount } = require('./utils');

module.exports = (testPath, tech) => {
  const eslintResponse = [];

  if (tech === 'angular') {
    return eslintResponse;
  }

  const eslintConfig = require(`../../${testPath}/.eslintrc.js`);

  eslintResponse.push({
    metric: eslintMetrics.ESLINT_ERRORS,
    description: 'Errores de eslint',
    value: getLinterErrorCount(testPath)
  });

  eslintResponse.push({
    metric: eslintMetrics.ESLINT_CONFIG,
    description: `El proyecto esta configurado con el eslint: ${eslintTechConfig[tech]}`,
    value:
      eslintConfig &&
      eslintConfig.extends &&
      eslintConfig.extends.some(extension => extension === eslintTechConfig[tech])
  });

  return eslintResponse;
};
