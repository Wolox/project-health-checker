const envMetrics = require('../../envChecks/constants');

const testMetrics = require('../../testChecks/constants');
const dependenciesMetrics = require('../../dependenciesChecks/constants');
const seoMetrics = require('../seoChecks/constants');

const { generalMetrics } = require('../../generalChecks/constants');
const { angularMetrics } = require('./constants');

const limits = {
  minTestCoverage: 80,
  maxUnusedDependencies: 10,
  pwaMin: 30
};

const testSummary = (summary, reports) => {
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
    value: reports.filter(({ metric, value }) => metric === angularMetrics.USE_JEST && value)
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
    value: reports.filter(({ metric, value }) => metric === angularMetrics.NG_BUILD && value)
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
    value: reports
      .filter(({ metric }) => metric === generalMetrics.FOLDER_STRUCTURE)
      .some(elem => elem.description.includes('services'))
  });
  // summary.push({
  //   metric: 'SUMMARY-CLIENT-SERVER-2',
  //   description: 'Solo se utiliza el httpClient para comunicarse con API externas',
  //   value: true
  // });
  // summary.push({
  //   metric: 'SUMMARY-CLIENT-SERVER-3',
  //   description: 'Utiliza services globales o ngRx para el manejo de la información global.',
  //   value: 'Manual'
  // });
};

module.exports = reports => {
  const summary = [];
  testSummary(summary, reports);
  securitySummary(summary, reports);
  buildingSummary(summary, reports);
  uiUxSummary(summary, reports);
  clientServerSummary(summary, reports);
  // performanceSummary(summary, reports);
  console.log('Parcial Angular Summary', summary);
  return [...summary, ...reports];
};