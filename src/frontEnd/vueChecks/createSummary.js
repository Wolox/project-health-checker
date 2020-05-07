const dependenciesChecks = require('../../dependenciesChecks/constants');
const testMetrics = require('../../testChecks/constants');

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

module.exports = reports => {
  //  TODO: Create a summary based on the vue DSP
  const summary = [];
  testSummary(summary, reports);
  return [...summary, ...reports];
};
