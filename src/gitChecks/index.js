const { requestChangesPercentage, getRepositoryInfo } = require('./services/requestChangesPercentaje');

module.exports = (repository, organization) => {
  getRepositoryInfo(repository, organization).then(
    response =>
      response.data.data.repository.refs.edges.some(branch => branch.node.name === 'master') &&
      response.data.data.repository.refs.edges.some(branch => branch.node.name === 'development')
  );

  requestChangesPercentage(repository, organization);

  getRepositoryInfo(repository, organization).then(
    response =>
      response.data.data.branchProtectionRules.edges.some(
        rule => rule.node.pattern === 'development' && rule.node.requiresApprovingReviews
      ) &&
      response.data.data.branchProtectionRules.edges.some(
        rule => rule.node.pattern === 'master' && rule.node.requiresApprovingReviews
      )
  );
};
