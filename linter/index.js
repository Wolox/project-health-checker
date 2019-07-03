const { CLIEngine } = require('eslint');
const cli = new CLIEngine({
  baseConfig: {
    extends: ['plugin:react/recommended', 'wolox-react']
  },
  envs: ['browser', 'mocha']
});

exports.verify = function verify() {
  return cli.executeOnFiles(['test/']).errorCount;
};
