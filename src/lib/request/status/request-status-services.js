const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://status.robertsspaceindustries.com/static/content/api/v0/',
  timeout: 2500,
});

const requestData = async () => {
  const result = await instance.get('/systems.en.json')
    .catch(() => null);

  if (result === null || result.status !== 200) {
    return null;
  }

  return result.data;
};

module.exports = requestData;
