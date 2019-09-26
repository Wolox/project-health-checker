const jest = require("jest");
const { red, green } = require('../constants/colors');

module.exports = testPath => {
  
  const options = {
    projects: [testPath],
    silent: true,
  };

  jest
  .runCLI(options, options.projects)
  .then( (response) => {
    const averageCoverageTests = Math.round((response.results.numPassedTests / response.results.numTotalTests) * 100)
    if(averageCoverageTests>=70){
      console.log(green, "El porcentaje de tests unitarios pasados con éxito es de: " + averageCoverageTests + "%");
    } else {
      console.error(red, "El porcentaje de tests unitarios exitosos no supera el 70%, total: " + averageCoverageTests + "%");
    }
  })
  .catch(() => {
    console.error("Error al realizar la prueba de covertura");
  });
}
