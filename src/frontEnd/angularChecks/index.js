const fs = require('fs');
const path = require('path');
const { findSync } = require('find-in-files');
const { fetchJSON, getDirectories } = require('../../utils');
const { angularMetrics, limits, JEST_REGEX, NG_BUILD_REGEX, HTTP_CLIENT_IMPORT } = require('./constants');
const { checkTrackByUse, checkInjectable } = require('./utils');

module.exports = async testPath => {
  const angularResult = [];
  const packageJson = fetchJSON(`${testPath}/package.json`);
  const testConfigFile = fs.readFileSync(`${testPath}/src/test.ts`);
  const apiConfigPath = path.join(testPath, 'src/app/services/api.service.ts');
  const apiConfigFile = fs.existsSync(apiConfigPath) ? fs.readFileSync(apiConfigPath) : undefined;
  const screensPath = path.join(testPath, 'src/app/screens');
  const screensFolder = fs.existsSync(screensPath) ? getDirectories(screensPath) : undefined;
  const mainFilePath = path.join(testPath, 'src/main.ts');
  const mainFile = fs.existsSync(mainFilePath) && fs.readFileSync(mainFilePath);
  const appRoutesFile = fs.readFileSync(path.join(testPath, 'src/app/app-routing.module.ts'));

  angularResult.push({
    metric: angularMetrics.USE_JEST,
    description: 'El proyecto usa JEST como framework de pruebas',
    value:
      JEST_REGEX.test(packageJson.scripts.test) ||
      testConfigFile.toString().includes("import 'jest-preset-angular'")
  });

  angularResult.push({
    metric: angularMetrics.NG_BUILD,
    description: 'El proyecto usa ng-build para el building',
    value: NG_BUILD_REGEX.test(packageJson.scripts.build)
  });

  angularResult.push({
    metric: angularMetrics.USE_HTTP_CLIENT,
    description: 'Usa http-client para la configuración del api.service.ts',
    value: apiConfigFile && apiConfigFile.includes(HTTP_CLIENT_IMPORT)
  });

  angularResult.push({
    metric: angularMetrics.NGRX,
    description: 'Usa ngRx para el manejo de estados',
    value: await findSync('StoreModule.forRoot', path.join(testPath, 'src/app'), 'app.module.ts')
  });

  angularResult.push({
    metric: angularMetrics.SINGLETON_SERVICE,
    description: 'Cada screen tiene un service si no se usa ngRx',
    value:
      screensFolder &&
      screensFolder.every(
        screen =>
          angularResult.some(({ metric, value }) => metric === angularMetrics.NGRX && value) &&
          (fs.existsSync(path.join(screensPath, screen, `${screen}.services.ts`)) ||
            fs.existsSync(path.join(screensPath, screen, `services/${screen}.services.ts`)))
      )
  });

  angularResult.push({
    metric: angularMetrics.COMPONENTS_LENGTH,
    description: 'Los archivos component.ts no superan las 200 líneas',
    value: Object.values(await findSync('\n', testPath, '.component.ts$')).every(
      ({ count }) => count <= limits.maxNumberOfComponentLines
    )
  });

  angularResult.push({
    metric: angularMetrics.TEMPLATE_LENGTH,
    description: 'Los archivos component.html no superan las 150 líneas',
    value: Object.values(await findSync('\n', testPath, '.component.html$')).every(
      ({ count }) => count <= limits.maxNumberOfTemplateLines
    )
  });

  angularResult.push({
    metric: angularMetrics.PRODUCTION_MODE_ENABLED,
    description: '',
    value: mainFile && mainFile.toString().includes('enableProdMode()')
  });

  angularResult.push({
    metric: angularMetrics.NG_FOR_TRACK_BY,
    description: 'Cuando se utiliza ngFor se define el atributo trackBy',
    value: await checkTrackByUse(testPath)
  });

  angularResult.push({
    metric: angularMetrics.LAZY_LOADING,
    description: 'Los componentes de las rutas se obtienen utilizando lazy loading',
    value: (() => {
      const appRoutesFileStrig = appRoutesFile.toString();
      const nPaths = (appRoutesFileStrig.match(/path: /g) || []).length;
      const nRedirectTo = (appRoutesFileStrig.match(/redirectTo: /g) || []).length;
      const nLoadChildren = (appRoutesFileStrig.match(/loadChildren: /g) || []).length;

      return nPaths === nLoadChildren + nRedirectTo;
    })()
  });

  angularResult.push({
    metric: angularMetrics.PURE_PIPES,
    description: 'Todos los custom-pipes son puros',
    value: !Object.keys(await findSync('pure: false', path.join(testPath, 'src'), 'pipe.ts$')).length
  });

  angularResult.push({
    metric: angularMetrics.INJECTABLE_DECORATOR,
    description: 'Los services utilizan @Injectable en lugar de providers',
    value: await checkInjectable(screensFolder, screensPath, testPath)
  });

  angularResult.push({
    metric: angularMetrics.STATE_MANAGEMENT,
    description: 'El estado de la aplicación se maneja a través de servicios globales o ngRx',
    value:
      angularResult.some(({ metric, value }) => metric === angularResult.NGRX && value) ||
      fs.existsSync(path.join(testPath, 'src/app/services/app.services.ts')) ||
      fs.existsSync(path.join(testPath, 'src/app/app.services.ts'))
  });

  return angularResult;
};
