const dependenciesChecks = require('../../dependenciesChecks/constants');
const testMetrics = require('../../testChecks/constants');
const envMetrics = require('../../envChecks/constants');

const limits = {
  reduxRecomposePercentage: 70
};

const testSummary = (summary, reports) => {
  console.log('Resports', reports);
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
    description: 'El proyecto usa jest and vue-test-utils',
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

module.exports = reports => {
  //  TODO: Create a summary based on the vue DSP
  const summary = [];
  testSummary(summary, reports);
  securitySummary(summary, reports);
  return [...summary, ...reports];
};
