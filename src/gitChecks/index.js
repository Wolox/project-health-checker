const { red } = require('../constants/colors');
const { requestChangesPercentage, getRepositoryInfo } = require('./services/requestChangesPercentaje');

module.exports = (repository, organization) => {
  getRepositoryInfo(repository, organization)
    .then(
      response =>
        response.data.data.repository.refs.edges.some(branch => branch.node.name === 'master') &&
        response.data.data.repository.refs.edges.some(branch => branch.node.name === 'development')
    )
    .catch(error => console.log(red, `Error de git: ${error}`));

  requestChangesPercentage(repository, organization);

  getRepositoryInfo(repository, organization)
    .then(
      response =>
        response.data.data.branchProtectionRules.edges.some(
          rule => rule.node.pattern === 'development' && rule.node.requiresApprovingReviews
        ) &&
        response.data.data.branchProtectionRules.edges.some(
          rule => rule.node.pattern === 'master' && rule.node.requiresApprovingReviews
        )
    )
    .catch(error => console.log(red, `Error de git: ${error}`));
};
