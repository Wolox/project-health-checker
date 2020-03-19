const axios = require('axios');
const token = Buffer.from(`${process.env.KIBANA_USER}:${process.env.KIBANA_PWD}`, 'utf8').toString('base64');

module.exports = axios.create({
  baseURL: process.env.ELASTICSEARCH_APM_BASE_URL,
  timeout: 5000,
  headers: {
    Autorization: `Basic ${token}`
  }
});
