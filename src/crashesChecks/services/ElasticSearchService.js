const api = require('../config/api');

module.exports = {
  getProjectEnvironmentErrors: (projectName, environment) => {
    const body = {
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
    };
    const url = `/${process.env.APM_VERSION}-error-*/_count`;
    return api.post(url, body);
  }
};
