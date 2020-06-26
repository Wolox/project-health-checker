const dependenciesChecks = require('../../dependenciesChecks/constants');
const testMetrics = require('../../testChecks/constants');
const envMetrics = require('../../envChecks/constants');
const { generalMetrics } = require('../../generalChecks/constants');
const { vueMetrics } = require('../vueChecks/constants');
const { eslintMetrics } = require('../../linterChecks/constants');
const dependenciesMetrics = require('../../dependenciesChecks/constants');
const seoMetrics = require('../seoChecks/constants');
const { limits } = require('./constants');

const testSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-TESTING-1',
    description: 'La arquitectura de la aplicación se encuentra preparada para implementar test unitarios',
    value: reports.some(elem => elem.metric === dependenciesChecks.JEST && elem.value)
  });

  summary.push({
    metric: 'SUMMARY-TESTING-2',
    description:
      'La arquitectura de la aplicación se encuentra preparada para implementar test de integración',
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
      'Cada nueva funcionalidad unida a "development" está acompañada por un test de integración que valida el correcto funcionamiento de la misma.',
    value: 'N/A'
  });

  summary.push({
    metric: 'SUMMARY-TESTING-5',
    description: 'El proyecto usa vue-test-utils',
    value: reports.some(report => report.metric === dependenciesChecks.VUE_TEST_UTILS && report.value)
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
      elem => elem.metric === generalMetrics.OUTDATED_DEPENDENCIES && elem.value.includes('vue')
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
    value: reports.some(({ metric, value }) => metric === eslintMetrics.ESLINT_ERRORS && !value)
  });

  summary.push({
    metric: 'SUMMARY-BUILDING-5',
    description: 'El proyecto genera archivos minificados en el build',
    value: 'N/A'
  });

  summary.push({
    metric: 'SUMMARY-BUILDING-6',
    description: 'El proyecto usa vue-cli-service para generar el build en producción',
    value: reports.some(({ metric, value }) => metric === vueMetrics.USE_CLI_SERVICE && value)
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
    value: reports.some(elem => elem.metric === vueMetrics.I18N && elem.value >= limits.i18nPercentage)
  });

  summary.push({
    metric: 'SUMMARY-UI-UX-4',
    description: 'Proyecto respeta la estructura de directorios sugerida',
    value: reports.filter(elem => elem.metric === generalMetrics.FOLDER_STRUCTURE).every(elem => elem.value)
  });

  summary.push({
    metric: 'SUMMARY-UI-UX-7',
    description: 'Todos los SFCs deben ser scoped',
    value: reports.some(elem => elem.metric === vueMetrics.SCOPED_STYLES && elem.value)
  });
};

const clientServerSummary = (summary, reports) => {
  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-1',
    description: 'El proyecto posee services dedicados a los distintos recurso que posee',
    value: reports.some(
      elem =>
        elem.metric === generalMetrics.FOLDER_STRUCTURE && elem.description.includes('services') && elem.value
    )
  });

  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-2',
    description: 'Se utiliza una configuración de apisauce / axios para cada API que se comunique',
    value: reports.some(elem => elem.metric === dependenciesMetrics.AXIOS_APISAUCE && elem.value)
  });

  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-3',
    description: 'Usa Vuex store para manejar el estado de la aplicación ',
    value: reports.some(({ metric, value }) => metric === vueMetrics.USE_VUEX && value)
  });

  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-4',
    description: 'El estado global se separa en módulos',
    value: reports.some(({ metric, value }) => metric === vueMetrics.STATE_MODULES && value)
  });

  summary.push({
    metric: 'SUMMARY-CLIENT-SERVER-5',
    description: 'Componentes de un solo archivo (SFC) no superan 400 lineas',
    value: reports.some(({ metric, value }) => metric === vueMetrics.VALID_LINES_LENGTH && !value)
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
    description: 'El proyecto posee métricas de SEO (según lighthouse) mayor al 80%',
    value: reports.some(
      elem => elem.metric === seoMetrics.LIGHTHOUSE_SEO_OVERALL && elem.value >= limits.minSeo
    )
  });

  summary.push({
    metric: 'SUMMARY-PERFORMANCE-3',
    description: 'El proyecto posee un First Contentful Paint menor a 4 segundos',
    value: reports.some(
      elem => elem.metric === seoMetrics.FIRST_CONTENTFUL_PAINT && elem.value >= limits.minFirstPaintScore
    )
  });

  summary.push({
    metric: 'SUMMARY-PERFORMANCE-4',
    description: 'El proyecto usa Lazy Loading para las rutas',
    value: reports.some(({ metric, value }) => metric === vueMetrics.USE_LAZY_ROUTES && value)
  });

  summary.push({
    metric: 'SUMMARY-PERFORMANCE-5',
    description: 'First Meaningful Paint no superior a 4s',
    value: reports.some(
      elem => elem.metric === seoMetrics.LOAD_TIME && elem.value >= limits.minFirstPaintScore
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
