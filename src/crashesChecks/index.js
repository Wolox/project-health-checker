const ElasticSearchService = require('./services/ElasticSearchService');
const { DEFAULT_ENVIRONMENTS_INFO } = require('./constants');
const { green, red } = require('../constants/colors');

const crashesCheck = async (projectName, environmentInfo) => {
  const arrayOfData = await Promise.all(
    environmentInfo.environments.map(environment =>
      ElasticSearchService.getProjectEnvironmentErrors(projectName, environment)
        .then(response => {
          if (response.data.count === 0) {
            console.log(
              red,
              `El ambiente ${environment} del projecto no tiene errores o no esta configurado en kibana`
            );
          }
          return Promise.resolve(response.data.count);
        })
        .catch(() => {
          console.log(red, `Hubo un error y no se pudo conectar a kibana en el ambiente ${environment}`);
          return Promise.resolve(0);
        })
    )
  );
  const sumOfCrashes = arrayOfData.reduce((acum, value) => acum + value, 0);
  return Promise.resolve({
    metric: environmentInfo.metricName,
    description: environmentInfo.description,
    value: sumOfCrashes
  });
};

module.exports = async projectName => {
  const crashesMetrics = await Promise.all([
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS_INFO.PRODUCTION),
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS_INFO.PRE_PRODUCTION)
  ]);
  console.log(green, 'Chequeos de crashes terminados con exito ✓');
  return crashesMetrics;
};
