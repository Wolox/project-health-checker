const rimraf = require('rimraf');
const runEslintChecks = require('../linterChecks');
const { promisify } = require('util');
const getSize = require('get-folder-size');

const { green } = require('../constants/colors');
const shell = require('shelljs');

shell.config.silent = true;
const seconds = 1000;
const mega = 1000000;

module.exports = async testPath => {
  console.log(green, 'Empezando instalacion de dependencias para el build...');
  shell.exec(`npm i --prefix ${testPath}`);
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
    { metric: 'Build', description: 'Build Time', value: buildTime },
    { metric: 'Build', description: 'Build Size', value: buildSize }
  ];
};