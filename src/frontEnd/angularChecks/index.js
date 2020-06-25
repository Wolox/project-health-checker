const fs = require('fs');
const path = require('path');
const { fetchJSON, getClocReport } = require('../../utils');
const {
  angularMetrics,
  limits,
  folderHasService,
  JEST_REGEX,
  NG_BUILD_REGEX,
  HTTP_CLIENT_IMPORT
} = require('./constants');
const { checkTrackByUse, checkInjectable, filesHasString } = require('./utils');

module.exports = async testPath => {
  const angularResult = [];
  const packageJson = fetchJSON(`${testPath}/package.json`);
  const testConfigFile = fs.readFileSync(`${testPath}/src/test.ts`);
  const apiConfigPath = path.join(testPath, 'src/app/services/api.service.ts');
  const apiConfigFile = fs.existsSync(apiConfigPath) && fs.readFileSync(apiConfigPath);
  const screensPath = path.join(testPath, 'src/app/pages');
  const screensFolder = fs.existsSync(screensPath) && fs.readdirSync(screensPath);
  const clocReport = getClocReport(path.resolve(testPath), 'angular');
  const componentFilePaths = Object.keys(clocReport).filter(filepath => /.component.ts$/.test(filepath));
  const templateFilePaths = Object.keys(clocReport).filter(filepath => /.component.html$/.test(filepath));
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
    metric: angularMetrics.SERVICE_PER_SCREEN,
    description: 'Cada screen tiene un service.ts',
    value:
      screensFolder &&
      screensFolder.every(screen => {
        const screenContent = fs.readdirSync(path.join(screensPath, screen));
        return folderHasService(screenContent);
      })
  });

  angularResult.push({
    metric: angularMetrics.COMPONENTS_LENGTH,
    description: 'Los archivos component.ts no superan las 200 líneas',
    value: componentFilePaths.every(filepath => clocReport[filepath].code <= limits.maxNumberOfComponentLines)
  });

  angularResult.push({
    metric: angularMetrics.TEMPLATE_LENGTH,
    description: 'Los archivos component.html no superan las 150 líneas',
    value: templateFilePaths.every(filepath => clocReport[filepath].code <= limits.maxNumberOfTemplateLines)
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
    value: await filesHasString('pure: true', path.join(testPath, 'src'), 'pipe.ts$')
  });

  angularResult.push({
    metric: angularMetrics.INJECTABLE_DECORATOR,
    description: 'Los services utilizan @Injectable en lugar de providers',
    value: await checkInjectable(screensFolder, screensPath, testPath)
  });

  return angularResult;
};
