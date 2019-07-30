const { REVIEW_STATE } = require('./constants');
const flattenDeep = require('lodash.flattendeep');

exports.hasBaseBranches = gitResponse =>
  gitResponse.data.data.repository.refs.edges.some(branch => branch.node.name === 'master') &&
  gitResponse.data.data.repository.refs.edges.some(branch => branch.node.name === 'stage') &&
  gitResponse.data.data.repository.refs.edges.some(branch => branch.node.name === 'development');

exports.hasBranchProtection = gitResponse =>
  gitResponse.data.data.repository.branchProtectionRules.edges.some(
    rule => rule.node.pattern === 'development' && rule.node.requiresApprovingReviews
  ) &&
  gitResponse.data.data.repository.branchProtectionRules.edges.some(
    rule => rule.node.pattern === 'stage' && rule.node.requiresApprovingReviews
  ) &&
  gitResponse.data.data.repository.branchProtectionRules.edges.some(
    rule => rule.node.pattern === 'master' && rule.node.requiresApprovingReviews
  );

exports.averageRequestChanges = response => {
  const findReviews = pullRequest => pullRequest.node.reviews.edges.map(edge => edge.node);
  const pullRequests = response.data.data.repository.pullRequests.edges;
  const reviews = pullRequests.map(pullRequest => findReviews(pullRequest));
  const totalReviews = flattenDeep(reviews).length;
  const totalChangesRequested = flattenDeep(reviews).filter(pr => pr.state === REVIEW_STATE.CHANGES_REQUESTED)
    .length;
  return (totalChangesRequested / totalReviews).toFixed(2);
};
