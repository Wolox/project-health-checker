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
    stdio: 'pipe',
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: -10
      }
    },
    cwd: testPath
  };
  

try {
  var ls = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['test'], options);
  console.log(ls);
} catch (e) {
  console.error("I got error: " + e.stderr ) ;
}

  
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
