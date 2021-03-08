const { getHoursBetween } = require('../utils');

exports.pullRequestLifeSpan = gitResponse => {
  // The mergedAt check is because of an open issue in Gitlab API
  // Merged MRs might not have a mergedAt timestamp
  // Issue: https://gitlab.com/gitlab-org/gitlab/-/issues/26911
  const mergedMRs = gitResponse.data.data.project.mergeRequests.edges.filter(
    mergeRequest => mergeRequest.node.state === 'merged' && mergeRequest.node.mergedAt
  );

  const hours = mergedMRs.reduce(
    (accumulator, mergeRequest) =>
      accumulator + getHoursBetween(mergeRequest.node.createdAt, mergeRequest.node.mergedAt),
    0
  );

  return Math.round(hours / mergedMRs.length);
};

exports.pickUpTime = gitResponse => {
  const mergeRequests = gitResponse.data.data.project.mergeRequests.edges;
  const hoursUntilPickup = mergeRequests.reduce((accumulator, mergeRequest) => {
    // eslint-disable-next-line init-declarations
    let pickupDate;
    if (mergeRequest.node.discussions && mergeRequest.node.discussions.edges.length > 0) {
      pickupDate = mergeRequest.node.discussions.edges[0].node.createdAt;
    } else if (mergeRequest.node.state === 'merged' && mergeRequest.node.mergedAt) {
      pickupDate = mergeRequest.node.mergedAt;
    } else {
      return accumulator;
    }
    return accumulator + getHoursBetween(mergeRequest.node.createdAt, pickupDate);
  }, 0);

  // eslint-disable-next-line no-magic-numbers
  return Math.round((hoursUntilPickup / mergeRequests.length) * 100) / 100;
};
