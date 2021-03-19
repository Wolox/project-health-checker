const { generalMetrics } = require('../generalChecks/constants');
const hundred = 100;

module.exports = reports => {
  const onlyBooleanSummary = reports.filter(
    reportValue => reportValue.metric && reportValue.metric.includes('SUMMARY') && typeof value === 'boolean'
  );

  return [
    ...reports,
    {
      metric: generalMetrics.CODE_QUALITY,
      description: 'Calidad del proyecto',
      value: (onlyBooleanSummary.filter(elem => elem.value).length / onlyBooleanSummary.length) * hundred // eslint-disable-line
    }
  ];
};
