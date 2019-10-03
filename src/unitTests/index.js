const jest = require("jest");
const { red, green } = require('../constants/colors');

module.exports = testPath => {
  
  const options = {
    projects: [testPath],
    silent: true,
    passWithNoTests: true,
    collectCoverage: true,
    collectCoverageFrom: ["**/src/**/?(*.)[jt]s?(x)"],
    coverageDirectory: './assets'
    
  };

  jest
  .runCLI(options, options.projects)
  .then(success)
  .catch(failed)

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
    console.error(red, "Error al realizar la prueba de covertura");
  }
}
