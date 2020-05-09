const envMetrics = require('../../envChecks/constants');

const { eslintMetrics } = require('../../linterChecks/constants');
const testMetrics = require('../../testChecks/constants');
const seoMetrics = require('../seoChecks/constants');

const { generalMetrics } = require('../../generalChecks/constants');

const { reactMetrics } = require('./constants');

const limits = {
  i18nPercentage: 40,
  reduxRecomposePercentage: 70,
  maxFiles: 2,
  maxUnusedDependencies: 10,
  minPerformance: 70,
  minBestPractices: 70,
  minSeo: 90,
  minTestCoverage: 70,
  minFirstPaint: 50,
  pwaMin: 30
};

const testSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-TESTING-1',
    description: 'La arquitectura de la aplicación se encuentra preparada para implementar test unitarios',
    value: reports.some(elem => elem.metric === generalMetrics.JEST && elem.value)
  });
  summary.push({
    metric: 'SUMMARY-TESTING-2',
    description:
      'La arquitectura de la aplicación se encuentra preparada para implementar test de instrumentación (UI)',
    value: 'N/A'
  });
  summary.push({
    metric: 'SUMMARY-TESTING-3',
    description: 'Hay una cobertura del 70% o más en los test unitarios',
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
    metric: 'SUMMARY-BUILDING-4',
    description: 'Se corre el checkeo de linter tanto antes de generar un build como de push',
    value: reports.some(({ metric, value }) => metric === eslintMetrics.ESLINT_ERRORS && !!value)
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
    metric: 'SUMMARY-UI-UX-1',
    description: 'El proyecto es mobile friendly según lighthouse',
    value: reports.some(
      elem => elem.metric === seoMetrics.LIGHTHOUSE_PWA_OVERALL && elem.value >= limits.pwaMin
    )
  });
  summary.push({
    metric: 'SUMMARY-UI-UX-2',
    description: 'El proyecto usa Sass respetando el linter correspondiente',
    value: reports.some(elem => elem.metric === eslintMetrics.ESLINT_CONFIG && elem.value)
  });
  summary.push({
    metric: 'SUMMARY-UI-UX-3',
    description: 'El proyecto posee internacionalización',
    value: reports.some(elem => elem.metric === generalMetrics.I18N && elem.value >= limits.i18nPercentage)
  });
  summary.push({
    metric: 'SUMMARY-UI-UX-4',
    description: 'Proyecto respeta la estructura de directorios sugerida',
    value: reports.filter(elem => elem.metric === generalMetrics.FOLDER_STRUCTURE).every(elem => elem.value)
  });
};

const clientServerSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-1',
    description: 'El proyecto posee services dedicados a los distintos recurso que posee',
    value: reports.some(
      elem =>
        elem.metric === reactMetrics.FOLDER_STRUCTURE && elem.description.includes('services') && elem.value
    )
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-2',
    description: 'Se utiliza una configuración de apisauce / axios para cada API que se comunique',
    value: reports.some(elem => elem.metric === generalMetrics.AXIOS_APISAUCE && elem.value)
  });
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-3',
    description: 'Existe un reducer para mantener el estado global de la aplicación',
    value: 'Manual'
  });
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
      reports.some(elem => elem.metric === reactMetrics.INDEX_LINES && elem.value <= limits.maxFiles) &&
      reports.some(elem => elem.metric === reactMetrics.LAYOUT_LINES && elem.value <= limits.maxFiles)
  });
};

const performanceSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-PERFORMANCE-1',
    description: 'No hay render blocking js',
    value: reports.some(
      elem =>
        elem.metric === seoMetrics.LIGHTHOUSE_BEST_PRACTICES_OVERALL && elem.value >= limits.minBestPractices
    )
  });

  summary.push({
    metric: 'SUMMARY-PERFORMANCE-2',
    description: 'El proyecto posee métricas de SEO (según lighthouse) mayor al 90%',
    value: reports.some(
      elem => elem.metric === seoMetrics.LIGHTHOUSE_PERFORMANCE_OVERALL && elem.value >= limits.minSeo
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
    metric: 'SUMMARY-PERFORMANCE-4',
    description: 'No hay llamadas a funciones dentro del JSX donde generan renders extra',
    value: reports.some(
      elem => elem.metric === seoMetrics.LIGHTHOUSE_PERFORMANCE_OVERALL && elem.value >= limits.minPerformance
    )
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
