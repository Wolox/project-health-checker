const axios = require('axios');

module.exports = axios.create({
  baseURL: process.env.ELASTICSEARCH_APM_BASE_URL,
  timeout: 5000,
  auth: {
    username: process.env.KIBANA_USER,
    password: process.env.KIBANA_PWD
  }
});
