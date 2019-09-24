const jest = require("jest");



module.exports = testPath => {
  
  const options = {
    projects: [testPath],
    silent: true,
  };

  jest
  .runCLI(options, options.projects)
  .then( (response) => {
    console.log(response);
  })
  .catch(() => {
    console.error("test fallido");
  });

}
