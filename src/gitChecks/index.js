/* eslint-disable max-statements */
/* eslint-disable no-console */
const { red, green } = require('../constants/colors');
const { getRepositoryInfo, getReleaseInfo } = require('./services/gitService');
const { ERROR } = require('./constants');

const limits = require('../constants/limits');

const { hasBaseBranches, hasBranchProtection, averageRequestChanges, countBranches } = require('./utils');

const parseRepository = url => url.split('/').filter(elem => elem !== '..' && elem !== '.')[0];

module.exports = async (repository, organization) => {
  const gitData = [];
  const repositoryUrl = parseRepository(repository);
  try {
    const repositoryInfo = await getRepositoryInfo(repositoryUrl, organization);
    if (hasBaseBranches(repositoryInfo)) {
      console.log(green, 'Existen las branches development, stage y master');
      gitData.push({
        metric: 'GITHUB',
        description: 'Existen las branches development, stage y master',
        value: 'SI'
      });
    } else {
      console.log(red, 'No existen las branches development, stage y master');
      gitData.push({
        metric: 'GITHUB',
        description: 'Existen las branches development, stage y master',
        value: 'NO'
      });
    }
    if (hasBranchProtection(repositoryInfo)) {
      console.log(green, 'Las branches estan protegidas');
      gitData.push({
        metric: 'GITHUB',
        description: 'Las branches estan protegidas',
        value: 'SI'
      });
    } else {
      console.log(red, 'Las branches no estan protegidas');
      gitData.push({
        metric: 'GITHUB',
        description: 'Las branches estan protegidas',
        value: 'NO'
      });
    }
    const amountOfBranches = countBranches(repositoryInfo);
    if (amountOfBranches > limits.branches) {
      console.log(red, `Demasiadas branches: ${amountOfBranches}`);
      gitData.push({
        metric: 'GITHUB',
        description: 'Demasiadas branches abiertas',
        value: amountOfBranches
      });
    }

    const average = averageRequestChanges(repositoryInfo);
    console.log(average < limits.prRebound ? green : red, `Promedio de cambios pedidos por PR: ${average}`);
    gitData.push({
      metric: 'GITHUB',
      description: 'Promedio de cambios pedidos por PR',
      value: average
    });

    const pullRequestInfo = await getReleaseInfo(repositoryUrl, organization);
    const { pullRequests, releases } = pullRequestInfo.data.data.repository;
    if (pullRequests.edges.length <= releases.edges.length) {
      console.log(green, 'Hay un release por cada PR a master');
      gitData.push({
        metric: 'GITHUB',
        description: 'Hay un release por cada PR a master',
        value: 'SI'
      });
    } else {
      console.log(
        red,
        `Hay mas PRs a master que releases: ${pullRequests.edges.length - releases.edges.length}`
      );
      gitData.push({
        metric: 'GITHUB',
        description: 'Hay mas PRs a master que releases',
        value: pullRequests.edges.length - releases.edges.length
      });
    }
  } catch {
    console.log(red, `Error de git: ${ERROR.REPO_NOT_FOUND}`);
    gitData.push({
      metric: 'GITHUB',
      description: 'Error de git',
      value: ERROR.REPO_NOT_FOUND
    });
  }

  return gitData;
};
