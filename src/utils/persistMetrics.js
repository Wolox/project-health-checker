const axios = require('axios');
const kebabCase = require('lodash.kebabcase');

const { buildMetrics } = require('../buildChecks/constants');

const testMetrics = require('../testChecks/constants');
const seoMetrics = require('../frontEnd/seoChecks/constants');
const dependenciesMetrics = require('../dependenciesChecks/constants');

const { generalMetrics } = require('../generalChecks/constants');

const { gitMetrics } = require('../gitChecks/constants');
const { DEFAULT_ENVIRONMENTS_INFO } = require('../crashesChecks/constants');

const engineeringMetrics = [
  testMetrics.CODE_COVERAGE,
  generalMetrics.CODE_QUALITY,
  dependenciesMetrics.DIRECT_DEPENDENCIES,
  dependenciesMetrics.INDIRECT_DEPENDENCIES,
  buildMetrics.BUILD_TIME,
  buildMetrics.APP_SIZE,
  gitMetrics.CODE_REVIEW_AVG_TIME,
  gitMetrics.PICK_UP_TIME,
  seoMetrics.LOAD_TIME,
  DEFAULT_ENVIRONMENTS_INFO.PRODUCTION.metricName,
  DEFAULT_ENVIRONMENTS_INFO.PRE_PRODUCTION.metricName
];

const axiosApi = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000
});

const getGeneralTech = tech => (tech === 'nuxt' ? 'vue' : tech);

module.exports = (reportCodeQuality, tech, env, repoName) => {
  const metrics = reportCodeQuality.filter(metric =>
    engineeringMetrics.some(engMetric => engMetric === metric.metric)
  );
  const body = {
    env,
    tech: getGeneralTech(tech),
    repo_name: repoName,
    metrics: metrics
      .filter(({ value }) => !isNaN(value))
      .map(elem => ({
        name: kebabCase(elem.metric),
        version: '1.0',
        value: elem.value
      }))
  };
  // axiosApi.post('/metrics', body).catch(error => console.log(`Error: ${error}`));
};
