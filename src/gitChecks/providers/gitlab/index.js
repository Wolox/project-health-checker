const { ERROR, gitMetrics } = require('../../constants');
const { pullRequestLifeSpan, pickUpTime } = require('./metrics');
const { getRepositoryInfo } = require('./service');

module.exports = async (repository, organization) => {
  const gitData = [];

  try {
    const repositoryInfo = await getRepositoryInfo(repository, organization);
    gitData.push({
      metric: gitMetrics.CODE_REVIEW_AVG_TIME,
      description: 'Promedio de existencia de PR hasta merge - Hs',
      value: pullRequestLifeSpan(repositoryInfo)
    });

    gitData.push({
      metric: gitMetrics.PICK_UP_TIME,
      description: 'Pick up Time',
      value: pickUpTime(repositoryInfo)
    });
  } catch (e) {
    gitData.push({
      metric: 'GITHUB',
      description: 'Error de git',
      value: ERROR.REPO_NOT_FOUND
    });
  }

  return gitData;
};
