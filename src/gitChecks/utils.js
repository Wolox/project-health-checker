const { REVIEW_STATE } = require('./constants');
const flattenDeep = require('lodash.flattendeep');

const branchRules = (node, branch) =>
  node.pattern === branch && node.requiresApprovingReviews && node.dismissesStaleReviews;

exports.hasBaseBranches = gitResponse =>
  gitResponse.data.data.repository.refs.edges.some(branch => branch.node.name === 'master') &&
  gitResponse.data.data.repository.refs.edges.some(branch => branch.node.name === 'stage') &&
  gitResponse.data.data.repository.refs.edges.some(branch => branch.node.name === 'development');

exports.hasBranchProtection = gitResponse =>
  gitResponse.data.data.repository.branchProtectionRules.edges.some(rule =>
    branchRules(rule.node, 'development')
  ) &&
  gitResponse.data.data.repository.branchProtectionRules.edges.some(rule =>
    branchRules(rule.node, 'stage')
  ) &&
  gitResponse.data.data.repository.branchProtectionRules.edges.some(rule => branchRules(rule.node, 'master'));

exports.averageRequestChanges = gitResponse => {
  const findReviews = pullRequest => pullRequest.node.reviews.edges.map(edge => edge.node);
  const pullRequests = gitResponse.data.data.repository.pullRequests.edges;
  const reviews = pullRequests.map(pullRequest => findReviews(pullRequest));
  const totalChangesRequested = flattenDeep(reviews).filter(pr => pr.state === REVIEW_STATE.CHANGES_REQUESTED)
    .length;
  return (totalChangesRequested / pullRequests.length).toFixed(2);
};

exports.countBranches = gitResponse =>
  gitResponse.data.data.repository.refs.edges.filter(
    branch =>
      branch.node.name !== 'master' && branch.node.name !== 'stage' && branch.node.name !== 'development'
  ).length;
