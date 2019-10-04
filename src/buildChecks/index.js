const rimraf = require('rimraf');
const runEslintChecks = require('../linterChecks');

const { green } = require('../constants/colors');
const shell = require('shelljs');

shell.config.silent = true;
const seconds = 1000;

module.exports = testPath => {
  console.log(green, 'Empezando instalacion de dependencias para el build...');
  shell.exec(`npm i --prefix ${testPath}`);
  const eslintData = runEslintChecks(testPath);
  console.log(green, 'Chequeos de eslint terminados con exito ✓');
  console.log(green, 'Generando el build...');
  const start = new Date();
  shell.exec(`npm run build development --prefix ${testPath}`);
  const buildTime = (new Date().getTime() - start.getTime()) / seconds;
  console.log(green, 'Build terminado con exito ✓');
  rimraf.sync(`${testPath}/node_modules`);
  rimraf.sync(`${testPath}/build`);
  return [...eslintData, { metric: 'Build', description: 'Build Time', value: `${buildTime}` }];
};
