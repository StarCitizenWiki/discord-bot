const axios = require('axios');
const { api_url, locale } = require('../../../config.json');

const instance = axios.create({
  baseURL: `${api_url}/api`,
  timeout: 5000,
  params: {
    locale,
  },
});

module.exports = instance;
