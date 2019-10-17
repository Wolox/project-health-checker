const envMetrics = require('../../envChecks/constants');

const frontendMetrics = require('../constants');

const { generalMetrics } = require('../../generalChecks/constants');

const reactMetrics = require('./constants');

const limits = {
  i18nPercentage: 40,
  reduxRecomposePercentage: 70,
  maxFiles: 2,
  maxUnusedDependencies: 10
};

const testSummary = summary => {
  summary.push({
    metric: 'SUMMARY-TESTING-2',
    description:
      'La arquitectura de la aplicación se encuentra preparada para implementar test de instrumentación (UI)',
    value: 'N/A'
  });
  summary.push({
    metric: 'SUMMARY-TESTING-4',
    description:
      'Cada nueva funcionalidad mergeada a "development" esta acompañada por un test de instrumentación (UI) que valida el correcto funcionamiento de la misma',
    value: 'N/A'
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
  summary.push({
    metric: 'SUMMARY-SECURITY-5',
    description: 'Las contraseñas no son nunca visibles para el usuario despues del login',
    value: 'Manual'
  });
};

const buildingSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-BUILDING-1',
    description: 'El proyecto utiliza la ultima o anteultima versión del framework',
    value: !reports.some(
      elem => elem.metric === generalMetrics.OUTDATED_DEPENDENCIES && elem.value.includes('react')
    )
  });
  summary.push({
    metric: 'SUMMARY-BUILDING-2',
    description: 'Las dependencias del proyecto están actualizadas',
    value:
      reports.filter(elem => elem.metric === generalMetrics.UNUSED_DEPENDENCIES).length <=
      limits.maxUnusedDependencies
  });
  summary.push({
    metric: 'SUMMARY-BUILDING-3',
    description: 'Se utiliza el package de deploy para la gestión de releases',
    value: 'Manual'
  });
  summary.push({
    metric: 'SUMMARY-BUILDING-6',
    description:
      'El proyecto usa webpack para generar el build en producción y babel para los imports con alias',
    value: reports.filter(elem => elem.metric === generalMetrics.BABEL_IMPORTS).every(elem => elem.value)
  });
};

const uiUxSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-UI-UX-3',
    description: 'El proyecto posee internacionalización',
    value: reports.some(elem => elem.metric === frontendMetrics.I18N && elem.value >= limits.i18nPercentage)
  });
  summary.push({
    metric: 'SUMMARY-UI-UX-4',
    description: 'Proyecto respeta la estructura de directorios sugerida',
    value: reports.filter(elem => elem.metric === generalMetrics.FOLDER_STRUCTURE).every(elem => elem.value)
  });
};

const clientServerSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-4',
    description: 'El proyecto utiliza redux recompose para el manejo óptimo de estados',
    value: reports.some(
      elem => elem.metric === reactMetrics.REDUX_RECOMPOSE && elem.value >= limits.reduxRecomposePercentage
    )
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-5',
    description:
      'Está bien delimitada la responsabilidad de los smart vs dummies components, teniendo layouts menores a 150 líneas',
    value:
      reports.some(elem => elem.metric === frontendMetrics.INDEX_LINES && elem.value <= limits.maxFiles) &&
      reports.some(elem => elem.metric === frontendMetrics.LAYOUT_LINES && elem.value <= limits.maxFiles)
  });
};

const performanceSummary = summary => {
  summary.push({
    metric: 'SUMMARY-PERFORMANCE-2',
    description: 'El proyecto posee métricas de SEO (según lighthouse) mayor al 90%',
    value: 'Lighthouse'
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
