const { generalMetrics } = require('../generalChecks/constants');
const hundred = 100;

module.exports = reports => {
  const onlyBooleanSummary = reports.filter(({ metric, value, description }) => {
    if (metric === undefined) {
      console.log(description);
    }
    return metric.includes('SUMMARY') && typeof value === 'boolean';
  });
  return [
    ...reports,
    {
      metric: generalMetrics.CODE_QUALITY,
      description: 'Calidad del proyecto',
      value: (onlyBooleanSummary.filter(elem => elem.value).length / onlyBooleanSummary.length) * hundred // eslint-disable-line
    }
  ];
};
