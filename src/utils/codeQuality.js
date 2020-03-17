const { generalMetrics } = require('../generalChecks/constants');
const hundred = 100;

module.exports = reports => {
  const onlyBooleanSummary = reports.filter(
    elem => elem.metric.includes('SUMMARY') && typeof elem.value === 'boolean'
  );
  return [
    ...reports,
    {
      metric: generalMetrics.CODE_QUALITY,
      description: 'Calidad del proyecto',
      value: (
        (onlyBooleanSummary.filter(elem => elem.value).length / onlyBooleanSummary.length) * hundred).toFixed(2) // eslint-disable-line
    }
  ];
};
