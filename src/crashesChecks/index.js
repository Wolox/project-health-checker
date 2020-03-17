const axios = require('axios');

const DEFAULT_ENVIRONMENTS = {
  PRODUCTION: ['master'],
  PRE_PRODUCTION: ['development', 'stage']
};

const token = Buffer.from(`${process.env.KIBANA_USER}:${process.env.KIBANA_PWD}`, 'utf8').toString('base64');

const axiosApi = axios.create({
  baseURL: process.env.ELASTICSEARCH_APM_BASE_URL,
  timeout: 5000,
  headers: {
    Autorization: `Basic ${token}`
  }
});

axiosApi.post(`${process.env.APM_VERSION}-error-*`, body).catch(error => console.log(`Error: ${error}`))