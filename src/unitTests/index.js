const { red, green } = require('../constants/colors');
var spawn = require('child_process').spawn;

module.exports = testPath => {


  
  

  /* 
  exec('cd '+testPath+' && npm test --coverage', (err, stdout) => {
    console.log("entro");
    if (err) {
      // node couldn't execute the command
      //failed(err);
      console.error(red, "Error al realizar la prueba de cobertura" + err);
      return;
    }
    
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);Z
    console.log(`stderr: ${stderr}`);
  }); */
  
  const options = {
    projects: [testPath],
    silent: true,
    passWithNoTests: true,
    collectCoverage: true,
    collectCoverageFrom: ["**/src/**/?(*.)[jt]s?(x)"],
    coverageDirectory: './report',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };
  
  var ls = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['test', '-- --coverage'], { stdio: 'inherit', cwd: testPath} );

  
  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
  });
  /* jest
  .runCLI(options, options.projects)
  .then(success)
  .catch(failed) */

  function success (response){
    if (response.results.numTotalTests == 0){
      console.log(red, "No se encontraron tests")
      return
    }
    const averageCoverageTests = Math.round((response.results.numPassedTests / response.results.numTotalTests) * 100)
    if(averageCoverageTests>=70){
      console.log(green, "El porcentaje de tests unitarios pasados con éxito es de: " + averageCoverageTests + "%");
    } else {
      console.error(red, "El porcentaje de tests unitarios exitosos no supera el 70%, total: " + averageCoverageTests + "%");
    }
  }

  function failed (response){
    console.error(red, "Error al realizar la prueba de covertura" + response);
  }
}
