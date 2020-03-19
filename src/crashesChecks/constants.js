module.exports.DEFAULT_ENVIRONMENTS_INFO = {
  PRODUCTION: {
    metricName: 'PRODUCTION_CRASHES',
    environments: ['production'],
    description: 'Crashes de producción del último mes'
  },
  PRE_PRODUCTION: {
    metricName: 'PRE_PRODUCTION_CRASHES',
    environments: ['development', 'stage'],
    description: 'Crashes de pre-producción del último mes'
  }
};
