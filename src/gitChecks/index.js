const { getRepositoryInfo } = require('./services/requestChangesPercentaje');
const { requestChangesPercentage } = require('./services/requestChangesPercentaje');

exports.hasBaseBranches = (organization, repository) =>
  getRepositoryInfo(organization, repository).then(
    response =>
      response.data.data.repository.refs.edges.some(branch => branch.node.name === 'master') &&
      response.data.data.repository.refs.edges.some(branch => branch.node.name === 'development')
  );

exports.hasLowPRRebound = () => requestChangesPercentage('Wolox', 'carvi-web');

exports.hasBranchProtectionRules = (organization, repository) =>
  getRepositoryInfo(organization, repository).then(
    response =>
      response.data.data.branchProtectionRules.edges.some(
        rule => rule.node.pattern === 'development' && rule.node.requiresApprovingReviews
      ) &&
      response.data.data.branchProtectionRules.edges.some(
        rule => rule.node.pattern === 'master' && rule.node.requiresApprovingReviews
      )
  );
