const shell = require('shelljs');
const { eslintMetrics, eslintTechConfig } = require('./constants');

module.exports = (testPath, tech) => {
  const eslintResponse = [];
  const eslintConfig = require(`../../${testPath}/.eslintrc.js`);
  const child = shell.exec(`npm run lint --prefix ${testPath}`);

  eslintResponse.push({
    metric: eslintMetrics.ESLINT_ERRORS,
    description: 'Errores de eslint',
    value: (child.stdout.toString().match(/\berror\b/g) || []).length
  });

  eslintResponse.push({
    metric: eslintMetrics.ESLINT_CONFIG,
    description: `El proyecto esta configurado con el eslint: ${eslintTechConfig[tech]}`,
    value:
      eslintConfig.extends && eslintConfig.extends.some(extension => extension === eslintTechConfig[tech])
  });

  return eslintResponse;
};
