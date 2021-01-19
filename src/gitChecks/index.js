const gitlabMetrics = require('./providers/gitlab');
const githubMetrics = require('./providers/github');

module.exports = provider => {
  switch (provider) {
    case 'github':
      return githubMetrics;
    case 'gitlab':
      return gitlabMetrics;
    default:
      throw Error('Invalid git provider');
  }
};
