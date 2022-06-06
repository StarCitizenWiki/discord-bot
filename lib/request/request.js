const axios = require('axios');
const { api_url, api_token, locale } = require('../../config.json');

const headers = {
  Accept: 'application/x.StarCitizenWikiApi.v1+json',
};

if (api_token !== null) {
  headers.Auth = `Bearer ${api_token}`;
}

const instance = axios.create({
  baseURL: `${api_url}/api`,
  timeout: 5000,
  headers,
  params: {
    locale,
  },
});

module.exports = instance;
