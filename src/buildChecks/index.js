const rimraf = require('rimraf');
const { promisify } = require('util');
const getSize = require('get-folder-size');
const shell = require('shelljs');

const { green } = require('../constants/colors');
const runEslintChecks = require('../linterChecks');
const runTestChecks = require('../testChecks');

const buildMetrics = require('./constants');

shell.config.silent = true;
const seconds = 1000;
const mega = 1000000;

module.exports = async testPath => {
  console.log(green, 'Empezando instalacion de dependencias para el build...');
  shell.exec(`npm i --prefix ${testPath}`);
  const testData = runTestChecks(testPath);
  console.log(green, 'Tests terminados con exito ✓');
  const eslintData = runEslintChecks(testPath);
  console.log(green, 'Chequeos de eslint terminados con exito ✓');
  console.log(green, 'Generando el build...');
  const start = new Date();
  shell.exec(`npm run build development --prefix ${testPath}`);
  const buildTime = (new Date().getTime() - start.getTime()) / seconds;
  console.log(green, 'Build terminado con exito ✓');
  const data = await promisify(getSize)(`${testPath}/build`);
  const buildSize = `${(data / mega).toFixed(2)}Mb`;
  rimraf.sync(`${testPath}/node_modules`);
  rimraf.sync(`${testPath}/build`);
  return [
    ...eslintData,
    ...testData,
    { metric: buildMetrics.BUILD_TIME, description: 'Build Time', value: buildTime },
    { metric: buildMetrics.APP_SIZE, description: 'Build Size', value: buildSize }
  ];
};
