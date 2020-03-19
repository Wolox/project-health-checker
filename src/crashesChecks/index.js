const ElasticSearchService = require('./services/ElasticSearchService');
const { DEFAULT_ENVIRONMENTS } = require('./constants');

const crashesCheck = async (projectName, environments) => {
  const responses = await Promise.all(
    environments.map(environment =>
      ElasticSearchService.getProjectEnvironmentErrors(projectName, environment)
    )
  );
  return responses;
};

module.exports = async projectName => {
  console.log('ejecutnado crashes checks');
  const responses = await Promise.all([
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS.PRODUCTION),
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS.PRE_PRODUCTION)
  ]);
};
