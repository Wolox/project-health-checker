const { eslintMetrics, eslintTechConfig } = require('./constants');
const { getLinterErrorCount } = require('./utils');

module.exports = (testPath, tech) => {
  const eslintResponse = [];

  let eslintConfig = null;

  try {
    eslintConfig = require(`../../${testPath}/.eslintrc.js`);
  } catch (error) {
    console.log("This project doesn't have Eslint configuration file");
  }

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
