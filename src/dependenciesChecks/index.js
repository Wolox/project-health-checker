const dependenciesMetrics = require('./constants');
const npmCheck = require('npm-check');

module.exports = async (installInfo, testPath, tech) => {
  const dependenciesResults = [];
  const totalPackages = installInfo.stdout.slice(
    installInfo.stdout.search('audited') + 'audited'.length,
    installInfo.stdout.search('packages in')
  );
  const currentState = await npmCheck({ cwd: testPath });

  const packages = currentState.get('packages');

  dependenciesResults.push({
    metric: dependenciesMetrics.DIRECT_DEPENDENCIES,
    description: 'Cantidad de dependencias directas',
    value: packages.length
  });

  dependenciesResults.push({
    metric: dependenciesMetrics.INDIRECT_DEPENDENCIES,
    description: 'Cantidad de dependencias indirectas',
    value: parseInt(totalPackages) - packages.length
  });

  packages.forEach(dependency => {
    const { moduleName, latest, packageJson, unused, bump } = dependency;
    if (unused) {
      dependenciesResults.push({
        metric: dependenciesMetrics.UNUSED_DEPENDENCIES,
        description: 'Dependencia no usada',
        value: moduleName
      });
    } else if (bump && bump !== 'patch') {
      dependenciesResults.push({
        metric: dependenciesMetrics.OUTDATED_DEPENDENCIES,
        description: 'Dependencia no actualizada',
        value: `${moduleName} Version: packageJson: ${packageJson} -> ultima ${latest}`
      });
    }
  });

  dependenciesResults.push({
    metric: dependenciesMetrics.JEST,
    description: 'Esta instalado Jest en el proyecto',
    value: packages.some(({ moduleName }) => moduleName === 'jest')
  });

  if (tech === 'angular') {
    dependenciesResults.push({
      metric: dependenciesMetrics.NG_RX,
      description: 'Esta instalado ngRx en el proyecto',
      value: packages.some(({ moduleName }) => moduleName === '@ngrx/store')
    });
  } else {
    dependenciesResults.push({
      metric: dependenciesMetrics.AXIOS_APISAUCE,
      description: 'Esta instalado axios o apisauce en el proyecto',
      value: packages.some(({ moduleName }) => moduleName === 'axios' || moduleName === 'apisauce')
    });
  }

  return dependenciesResults;
};
