/* eslint-disable no-console */
const { red } = require('../../constants/colors');
const { CLIEngine } = require('eslint');
const cli = new CLIEngine({
  baseConfig: {
    extends: ['plugin:react/recommended', 'wolox-react'],
    settings: {
      react: {
        version: process.env.REACT_VERSION
      }
    }
  },
  useEslintrc: false,
  envs: ['browser', 'mocha']
});

module.exports = testPath => {
  const extendsObj = require(`../../../${testPath}/.eslintrc.js`).extends;
  if (extendsObj.some(extension => extension === 'wolox-react')) {
    const eslintErrors = cli.executeOnFiles([testPath]).errorCount;
    if (eslintErrors) {
      console.log(red, `Errores de eslint: ${eslintErrors}`);
    }
  } else {
    console.log(red, 'El proyecto no esta configurado con el eslint: wolox-react');
  }
};
