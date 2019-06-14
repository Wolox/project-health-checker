const CLIEngine = require('eslint').CLIEngine;
var cli = new CLIEngine({
  baseConfig: {
    extends: ["plugin:react/recommended", 'wolox-react']
  },
  envs: ["browser", "mocha"]
});


exports.verify = function verify() {
  return cli.executeOnFiles(['test/']).errorCount;
}
