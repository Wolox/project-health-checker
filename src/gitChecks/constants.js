const { createObject } = require('../utils');

module.exports = {
  REVIEW_STATE: {
    APPROVED: 'APPROVED',
    COMMENTED: 'COMMENTED',
    CHANGES_REQUESTED: 'CHANGES_REQUESTED'
  },
  ERROR: {
    REPO_NOT_FOUND: 'ERROR: Could not find repository'
  },
  gitMetrics: createObject(['CODE_REVIEW_AVG_TIME', 'PICK_UP_TIME'])
};
