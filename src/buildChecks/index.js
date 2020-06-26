const rimraf = require('rimraf');
const { promisify } = require('util');
const getSize = require('get-folder-size');
const shell = require('shelljs');
const fs = require('fs');

const { green, red } = require('../constants/colors');
const runEslintChecks = require('../linterChecks');
const runTestChecks = require('../testChecks');
const runDependencyChecks = require('../dependenciesChecks');

const { buildMetrics, buildPath } = require('./constants');

shell.config.silent = true;
const seconds = 1000;
const mega = 1000000;

module.exports = async (testPath, tech, buildScriptName) => {
  let buildTime = undefined;
  let buildSize = undefined;
  const techBuildPath = buildPath[tech];
  console.log(green, 'Empezando instalacion de dependencias...');
  const installInfo = shell.exec(`npm i --prefix ${testPath}`);
  const testData = runTestChecks(testPath);
  const dependencyData = await runDependencyChecks(installInfo, testPath);
  console.log(green, 'Tests terminados con exito ✓');
  const eslintData = runEslintChecks(testPath, tech);
  console.log(green, 'Chequeos de eslint terminados con exito ✓');
  console.log(green, 'Generando el build...');
  const start = new Date();
  const buildExec = shell.exec(`npm run ${buildScriptName} --prefix ${testPath}`);
  if (buildExec.stderr) {
    console.log(buildExec.stderr);
  }
  if (fs.existsSync(`${testPath}/${techBuildPath}`)) {
    buildTime = (new Date().getTime() - start.getTime()) / seconds;
    console.log(green, 'Build terminado con exito ✓');
    const data = await promisify(getSize)(`${testPath}/${techBuildPath}`);
    buildSize = data / mega;
    rimraf.sync(`${testPath}/node_modules`);
    rimraf.sync(`${testPath}/${techBuildPath}`);
  } else {
    console.log(
      red,
      'El build no se pudo generar con exito. BUILD_TIME y APP_SIZE no se han podido sacar correctamente'
    );
  }

  return [
    ...eslintData,
    ...testData,
    ...dependencyData,
    { metric: buildMetrics.BUILD_TIME, description: 'Build Time - Seg', value: buildTime },
    { metric: buildMetrics.APP_SIZE, description: 'Build Size - Mb', value: buildSize }
  ];
};
