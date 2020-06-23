const fs = require('fs');
const path = require('path');
const { findSync } = require('find-in-files');
const { fetchJSON, getClocReport } = require('../../utils');
const {
  angularMetrics,
  limits,
  folderHasService,
  JEST_REGEX,
  NG_BUILD_REGEX,
  HTTP_CLIENT_IMPORT
} = require('./constants');

module.exports = testPath => {
  const angularResult = [];
  const packageJson = fetchJSON(`${testPath}/package.json`);
  const testConfigFile = fs.readFileSync(`${testPath}/src/test.ts`);
  const apiConfigPath = path.join(testPath, 'src/app/services/api.service.ts');
  const apiConfigFile = fs.existsSync(apiConfigPath) && fs.readFileSync(apiConfigPath);
  const screensPath = path.resolve(testPath, 'src/app/screens');
  const screensFolder = fs.existsSync(screensPath) && fs.readFileSync(screensPath);
  const clocReport = getClocReport(path.resolve(testPath), 'angular');
  const componentFilePaths = Object.keys(clocReport).filter(filepath => /.component.ts$/.test(filepath));
  const templateFilePaths = Object.keys(clocReport).filter(filepath => /.component.html$/.test(filepath));

  const everyScreenHasService = () => {
    const screens = screensFolder.reduce(
      (result, folder) => Object.assign(result, { [folder]: fs.readdirSync(path.join(screensPath, folder)) }),
      {}
    );
    return Object.values(screens).every(folderHasService);
  };

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
    value: screensFolder && everyScreenHasService(screensFolder)
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
    value: findSync('enableProdMode()', path.join(testPath, 'src'), 'main.ts$')
  });

  return angularResult;
};
