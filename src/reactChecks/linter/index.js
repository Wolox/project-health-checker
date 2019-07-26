/* eslint-disable no-console */
const { red } = require('../../constants/colors');
const { CLIEngine } = require('eslint');
const cli = new CLIEngine({
  baseConfig: {
    extends: ['plugin:react/recommended', 'wolox-react']
  },
  envs: ['browser', 'mocha']
});

module.exports = testPath => {
  const eslintErrors = cli.executeOnFiles([testPath]).errorCount;
  if (eslintErrors) {
    console.log(red, `Errores de eslint: ${eslintErrors}`);
  }
};
