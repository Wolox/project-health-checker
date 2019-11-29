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
    stdio: 'pipe',
    cwd: testPath
  };
  

try {
  var child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['test','--','--collectCoverage', '--collectCoverageFrom=**/*.{js,jsx}'], options);
  process.stdin.pipe(child.stdin)

  child.stdout.on('data', (data) => {
    var arrayLines = data.toString().split(/\|/);
    
    if(arrayLines[0].trim().localeCompare("All files") == 0 ){
      console.log('entro');
      console.log(green, `Porcentaje de covertura de tests: ${parseFloat(arrayLines[4])}%`);
    };
    /* const arrayAllFiles = arrayLines.find(element => element[0].trim().localeCompare("All files") == 0); 
      console.log(parseFloat(arrayAllFiles[4])); */
  });

  child.on('close', (data) => {
    if(data){

      console.log(red, 'No se encontraron tests');
    }
  });

  /* ls.stdout.on('data', (data) => {
    console.log(data.toString().split("\n"));
  }); */
  
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
