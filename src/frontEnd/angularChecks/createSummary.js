const fs = require('fs');
const path = require('path');
const { findSync } = require('find-in-files');

const envMetrics = require('../../envChecks/constants');
const testMetrics = require('../../testChecks/constants');
const dependenciesMetrics = require('../../dependenciesChecks/constants');
const { generalMetrics } = require('../../generalChecks/constants');
const seoMetrics = require('../seoChecks/constants');
const { fetchJSON, getClocReport } = require('../../utils');
const { angularMetrics } = require('./constants');

const limits = {
  minTestCoverage: 80,
  maxUnusedDependencies: 10,
  pwaMin: 30,
  maxNumberOfComponentLines: 200,
  maxNumberOfTemplateLines: 150,
  minBestPractices: 70,
  minSeo: 90,
  minFirstPaint: 50
};

// eslint-disable-next-line max-statements
module.exports = (reports, testPath) => {
  const summary = [];
  const packageJson = fetchJSON(`${testPath}/package.json`);
  const testConfigFile = fs.readFileSync(`${testPath}/src/test.ts`);
  const clocReport = getClocReport(path.resolve(testPath), 'angular');
  const componentFilePaths = Object.keys(clocReport).filter(filepath => /.component.ts$/.test(filepath));
  const templateFilePaths = Object.keys(clocReport).filter(filepath => /.component.html$/.test(filepath));

  // => Testing

  summary.push({
    metric: 'SUMMARY-TESTING-1',
    description: 'La arquitectura de la aplicación se encuentra preparada para implementar test unitarios',
    value: reports.some(elem => elem.metric === dependenciesMetrics.JEST && elem.value)
  });
  summary.push({
    metric: 'SUMMARY-TESTING-2',
    description:
      'La arquitectura de la aplicación se encuentra preparada para implementar test de instrumentación (UI)',
    value: 'N/A'
  });
  summary.push({
    metric: 'SUMMARY-TESTING-3',
    description: 'Hay una cobertura del 80% o más en los test unitarios',
    value: reports.some(
      elem => elem.metric === testMetrics.CODE_COVERAGE && elem.value >= limits.minTestCoverage
    )
  });
  summary.push({
    metric: 'SUMMARY-TESTING-4',
    description:
      'Cada nueva funcionalidad mergeada a "development" esta acompañada por un test de instrumentación (UI) que valida el correcto funcionamiento de la misma',
    value: 'N/A'
  });
  summary.push({
    metric: 'SUMMARY-TESTING-5',
    description: 'El proyecto usa JEST. Jasmine y Karma han sido removidos',
    value: /^jest/.test(packageJson.scripts.test) || testConfigFile.includes("import 'jest-preset-angular'")
  });

  // => Security

  summary.push({
    metric: 'SUMMARY-SECURITY-1',
    description: 'Existe un .env con variables de entorno en el proyecto',
    value: reports.some(elem => elem.metric === envMetrics.ENV_IS_USED && elem.value)
  });
  summary.push({
    metric: 'SUMMARY-SECURITY-2',
    description:
      'Las credenciales para firmar a producción se encuentran en un lugar seguro y disponible para el equipo de desarrollo y el TM',
    value: 'Manual'
  });
  summary.push({
    metric: 'SUMMARY-SECURITY-3',
    description: 'No se guardan claves secretas en texto plano o en constantes dentro de la aplicación',
    value: 'Manual'
  });
  // ? Need Review
  summary.push({
    metric: 'SUMMARY-SECURITY-6',
    description: 'Usa renderer 2 para manipular el DOM cuando es necesario.',
    value: true
  });

  // => Building

  summary.push({
    metric: 'SUMMARY-BUILDING-1',
    description: 'El proyecto utiliza la ultima o anteultima versión del framework',
    value: !reports.some(
      elem =>
        elem.metric === dependenciesMetrics.OUTDATED_DEPENDENCIES && elem.value.includes('@angular/core')
    )
  });
  summary.push({
    metric: 'SUMMARY-BUILDING-2',
    description: 'Las dependencias del proyecto están actualizadas',
    value:
      reports.filter(elem => elem.metric === dependenciesMetrics.UNUSED_DEPENDENCIES).length <=
      limits.maxUnusedDependencies
  });
  summary.push({
    metric: 'SUMMARY-BUILDING-3',
    description: 'Se utiliza el package de deploy para la gestión de releases',
    value: 'Manual'
  });
  summary.push({
    metric: 'SUMMARY-BUILDING-6',
    description: 'El proyecto usa webpack para generar el build en producción',
    value: /^ng build --prod/.test(packageJson.scripts.build)
  });

  // => UI & UX

  summary.push({
    metric: 'SUMMARY-UI-UX-1',
    description: 'El proyecto es mobile friendly según lighthouse',
    value: reports.some(
      elem => elem.metric === seoMetrics.LIGHTHOUSE_PWA_OVERALL && elem.value >= limits.pwaMin
    )
  });
  summary.push({
    metric: 'SUMMARY-UI-UX-4',
    description: 'Proyecto respeta la estructura de directorios sugerida',
    value: reports
      .filter(({ metric }) => metric === generalMetrics.FOLDER_STRUCTURE)
      .every(({ value }) => value)
  });
  // ? Need Review
  summary.push({
    metric: 'SUMMARY-UI-UX-5',
    description: 'Se prioriza el uso de formularios reactivos',
    value: true
  });

  // => Client Server Integration

  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-1',
    description: 'El proyecto posee services dedicados a los distintos recurso que posee',
    value: reports
      .filter(({ metric }) => metric === generalMetrics.FOLDER_STRUCTURE)
      .some(({ description }) => description.includes('services'))
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-2',
    description: 'Solo se utiliza el httpClient para comunicarse con API externas',
    value: reports.filter(({ metric, value }) => metric === angularMetrics.USE_HTTP_CLIENT && value)
  });
  // summary.push({
  //   metric: 'SUMMARY-CLIENT-SERVER-3',
  //   description: 'Utiliza services globales o ngRx para el manejo de la información global.',
  //   value: 'Manual'
  // });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-5',
    description:
      'Está bien delimitada la responsabilidad de los smart vs dummies components, teniendo components.ts menores a 200 líneas',
    value: componentFilePaths.every(filepath => clocReport[filepath].code <= limits.maxNumberOfComponentLines)
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-6',
    description: 'El template de los componentes tiene 150 líneas o menos.',
    value: templateFilePaths.every(filepath => clocReport[filepath].code <= limits.maxNumberOfTemplateLines)
  });

  // => Perfomance

  summary.push({
    metric: 'SUMMARY-PERFORMANCE-1',
    description: 'No hay render blocking js',
    value: reports.some(
      ({ metric, value }) =>
        metric === seoMetrics.LIGHTHOUSE_BEST_PRACTICES_OVERALL && value >= limits.minBestPractices
    )
  });
  summary.push({
    metric: 'SUMMARY-PERFORMANCE-2',
    description: 'El proyecto posee métricas de SEO (según lighthouse) mayor al 90%',
    value: reports.some(
      ({ metric, value }) => metric === seoMetrics.LIGHTHOUSE_SEO_OVERALL && value >= limits.minSeo
    )
  });
  summary.push({
    metric: 'SUMMARY-PERFORMANCE-3',
    description: 'El proyecto posee un First Contentful Paint menor a 4 segundos',
    value: reports.some(
      elem => elem.metric === seoMetrics.FIRST_CONTENTFUL_PAINT && elem.value >= limits.minFirstPaint
    )
  });

  summary.push({
    metric: 'SUMMARY-PERFORMANCE-6',
    description: 'Utilizar enableProdMode en produción',
    value: findSync('', testPath, '')
  });

  return [...summary, ...reports];
};
