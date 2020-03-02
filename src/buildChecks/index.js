const rimraf = require('rimraf');
const { promisify } = require('util');
const getSize = require('get-folder-size');
const shell = require('shelljs');

const { green } = require('../constants/colors');
const runEslintChecks = require('../linterChecks');
const runTestChecks = require('../testChecks');
const runDependencyChecks = require('../dependenciesChecks');

const { buildMetrics, buildPath, extraBuildParams } = require('./constants');

shell.config.silent = true;
const seconds = 1000;
const mega = 1000000;

module.exports = async (testPath, tech) => {
  const techBuildPath = buildPath[tech];
  const buildParams = extraBuildParams[tech];
  console.log(green, 'Empezando instalacion de dependencias...');
  const installInfo = shell.exec(`npm i --prefix ${testPath}`);
  // const testData = runTestChecks(testPath);
  const dependencyData = await runDependencyChecks(installInfo, testPath);
  console.log(green, 'Tests terminados con exito ✓');
  // const eslintData = runEslintChecks(testPath, tech);
  console.log(green, 'Chequeos de eslint terminados con exito ✓');
  console.log(green, 'Generando el build...');
  const start = new Date();
  shell.exec(`npm run build ${buildParams} --prefix ${testPath}`);
  const buildTime = (new Date().getTime() - start.getTime()) / seconds;
  console.log(green, 'Build terminado con exito ✓');
  const data = await promisify(getSize)(`${testPath}/${techBuildPath}`);
  const buildSize = (data / mega).toFixed(2);
  rimraf.sync(`${testPath}/node_modules`);
  rimraf.sync(`${testPath}/${techBuildPath}`);
  return [
    // ...eslintData,
    // ...testData,
    ...dependencyData,
    { metric: buildMetrics.BUILD_TIME, description: 'Build Time - Seg', value: buildTime },
    { metric: buildMetrics.APP_SIZE, description: 'Build Size - Mb', value: buildSize }
  ];
};
