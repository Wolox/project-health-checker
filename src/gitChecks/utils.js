const { REVIEW_STATE } = require('./constants');
const flattenDeep = require('lodash.flattendeep');

const milisecondsInHour = 1000 * 3600;

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
  return totalChangesRequested / pullRequests.length;
};

exports.countBranches = gitResponse =>
  gitResponse.data.data.repository.refs.edges.filter(
    branch =>
      branch.node.name !== 'master' && branch.node.name !== 'stage' && branch.node.name !== 'development'
  ).length;

const getHoursBetween = (startDate, endDate) => (new Date(endDate) - new Date(startDate)) / milisecondsInHour;

exports.pullRequestLifeSpan = gitResponse => {
  const mergedPRs = gitResponse.data.data.repository.pullRequests.edges.filter(
    pullRequest => pullRequest.node.merged
  );
  const hours = mergedPRs.reduce(
    (accumulator, pullRequest) =>
      accumulator + getHoursBetween(pullRequest.node.createdAt, pullRequest.node.closedAt),
    0
  );
  return Math.round(hours / mergedPRs.length);
};

exports.pickUpTime = gitResponse => {
  const pullRequests = gitResponse.data.data.repository.pullRequests.edges;
  const hoursUntilPickup = pullRequests.reduce((accumulator, pullRequest) => {
    if (pullRequest.node.reviews && pullRequest.node.reviews.edges.length > 0) {
      const pickupDate = pullRequest.node.reviews.edges[0].node.createdAt;
      return accumulator + getHoursBetween(pullRequest.node.createdAt, pickupDate);
    }
    return accumulator;
  }, 0);

  // eslint-disable-next-line no-magic-numbers
  return Math.round((hoursUntilPickup / pullRequests.length) * 100) / 100;
};
