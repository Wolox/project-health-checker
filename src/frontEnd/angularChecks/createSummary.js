const { limits } = require('./constants');
const envMetrics = require('../../envChecks/constants');
const testMetrics = require('../../testChecks/constants');
const dependenciesMetrics = require('../../dependenciesChecks/constants');
const { generalMetrics } = require('../../generalChecks/constants');
const seoMetrics = require('../seoChecks/constants');
const { angularMetrics } = require('./constants');

const testSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-TESTING-1',
    description: 'La arquitectura de la aplicación se encuentra preparada para implementar test unitarios',
    value: reports.some(({ metric, value }) => metric === dependenciesMetrics.JEST && value)
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
    value: reports.some(({ metric, value }) => metric === angularMetrics.USE_JEST && value)
  });
};

const securitySummary = (summary, reports) => {
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
};

const buildingSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-BUILDING-1',
    description: 'El proyecto utiliza la ultima o anteultima versión del framework',
    value: !reports.some(
      ({ metric, value }) =>
        metric === dependenciesMetrics.OUTDATED_DEPENDENCIES && value.includes('@angular/core')
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
    value: reports.some(({ metric, value }) => metric === angularMetrics.NG_BUILD && value)
  });
};

const uiUxSummary = (summary, reports) => {
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
};

const clientServerSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-1',
    description: 'El proyecto posee services dedicados a los distintos recurso que posee',
    value: reports.some(
      ({ metric, description }) =>
        metric === generalMetrics.FOLDER_STRUCTURE && description.includes('services')
    )
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-2',
    description: 'Solo se utiliza el httpClient para comunicarse con API externas',
    value: reports.some(({ metric, value }) => metric === angularMetrics.USE_HTTP_CLIENT && value)
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-3',
    description: 'Utiliza services globales o ngRx para el manejo de la información global.',
    value: reports.some(({ metric, value }) => metric === dependenciesMetrics.NG_RX && value)
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-4',
    description: 'Singleton services por screen',
    value: reports.some(({ metric, value }) => metric === angularMetrics.SERVICE_PER_SCREEN && value)
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-5',
    description:
      'Está bien delimitada la responsabilidad de los smart vs dummies components, teniendo components.ts menores a 200 líneas',
    value: reports.some(({ metric, value }) => metric === angularMetrics.COMPONENTS_LENGTH && value)
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-6',
    description: 'El template de los componentes tiene 150 líneas o menos.',
    value: reports.some(({ metric, value }) => metric === angularMetrics.TEMPLATE_LENGTH && value)
  });
};

const performanceSummary = (summary, reports) => {
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
      ({ metric, value }) => metric === seoMetrics.FIRST_CONTENTFUL_PAINT && value >= limits.minFirstPaint
    )
  });
  summary.push({
    metric: 'SUMMARY-PERFORMANCE-6',
    description: 'Utilizar enableProdMode en produción',
    value: reports.some(({ metric, value }) => metric === angularMetrics.PRODUCTION_MODE_ENABLED && value)
  });
  summary.push({
    metric: 'SUMMARY-PERFORMANCE-8',
    description: '*ngFor utilizar trackBy',
    value: reports.some(({ metric, value }) => metric === angularMetrics.NG_FOR_TRACK_BY && value)
  });
};

module.exports = reports => {
  const summary = [];

  testSummary(summary, reports);
  securitySummary(summary, reports);
  buildingSummary(summary, reports);
  uiUxSummary(summary, reports);
  clientServerSummary(summary, reports);
  performanceSummary(summary, reports);

  return [...summary, ...reports];
};
