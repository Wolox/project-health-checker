/* eslint-disable no-console */
const { red, green } = require('../constants/colors');
const getRepositoryInfo = require('./services/gitService');
const { ERROR } = require('./constants');

const limits = require('../constants/limits');

const { hasBaseBranches, hasBranchProtection, averageRequestChanges } = require('./utils');

module.exports = (repository, organization) => {
  getRepositoryInfo(repository, organization)
    .then(response => {
      if (hasBaseBranches(response)) {
        console.log(green, 'Existen las branches development, stage y master');
      } else {
        console.log(red, 'No existen las branches development, stage y master');
      }
      if (hasBranchProtection(response)) {
        console.log(green, 'Las branches estan protegidas');
      } else {
        console.log(red, 'Las branches no estan protegidas');
      }
      const average = averageRequestChanges(response);
      console.log(average < limits.prRebound ? green : red, `Promedio de cambios pedidos por PR: ${average}`);
    })
    .catch(() => console.log(red, `Error de git: ${ERROR.REPO_NOT_FOUND}`));
};
