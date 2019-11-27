const hundred = 100;

module.exports = reports => {
  const onlyBooleanSummary = reports.filter(
    elem => elem.metric.includes('SUMMARY') && typeof elem.value === 'boolean'
  );
  return [
    ...reports,
    {
      metric: 'Code quality',
      description: 'Calidad del proyecto',
      value: (
        (onlyBooleanSummary.filter(elem => elem.value).length / onlyBooleanSummary.length) * // eslint-disable-line no-extra-parens
        hundred
      ).toFixed(2)
    }
  ];
};
