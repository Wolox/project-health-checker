const api = require('../config/api');

module.exports = {
  getProjectEnvironmentErrors: (projectName, environment) => {
    api.get(`/${process.env.APM_VERSION}-error-*/_count`, {
      query: {
        bool: {
          must: [
            {
              match: {
                'service.name': projectName
              }
            },
            {
              match: {
                'service.environment': environment
              }
            },
            {
              range: {
                '@timestamp': {
                  gte: 'now-1M/d'
                }
              }
            }
          ]
        }
      }
    });
  }
};
