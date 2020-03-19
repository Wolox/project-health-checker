const ElasticSearchService = require('./services/ElasticSearchService');
const { DEFAULT_ENVIRONMENTS } = require('./constants');
const { green, red } = require('../constants/colors');

const crashesCheck = async (projectName, environments) => {
  const arrayOfResolvedPromises = await Promise.all(
    environments.map(environment =>
      ElasticSearchService.getProjectEnvironmentErrors(projectName, environment)
        .then(response => {
          if (response.data.count === 0) {
            console.log(
              red,
              `El ambiente ${environment} del projecto no tiene errores o no esta configurado en kibana`
            );
          }
        })
        .catch(console.log(red, 'Hubo un error y no se pudo conectar a kibana'))
    )
  );
  const sumOfCrashes = arrayOfResolvedPromises.reduce((acum, promise) => acum + promise.data.count, 0);
  return Promise.resolve(sumOfCrashes);
};

module.exports = async projectName => {
  const responses = await Promise.all([
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS.PRODUCTION),
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS.PRE_PRODUCTION)
  ]);
  console.log(green, 'Chequeos de crashes terminados con exito ✓');
  return responses;
};
