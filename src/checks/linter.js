const { CLIEngine } = require('eslint');
const cli = baseConfig =>
  new CLIEngine({
    baseConfig,
    envs: ['browser', 'mocha']
  });

module.exports = testPath => {
  const eslintResponse = [];
  const eslintConfig = require(`../../${testPath}/.eslintrc.js`);
  const eslintErrors = cli(eslintConfig).executeOnFiles([testPath]).errorCount;
  eslintResponse.push({
    metric: 'ESLINT',
    description: 'Errores de eslint',
    value: eslintErrors
  });
  if (eslintConfig.extends && !eslintConfig.extends.some(extension => extension === 'wolox-react')) {
    eslintResponse.push({
      metric: 'ESLINT',
      description: 'El proyecto esta configurado con el eslint: wolox-react',
      value: false
    });
  }

  return eslintResponse;
};
