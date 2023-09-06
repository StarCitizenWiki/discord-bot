const axios = require('axios');
const { wiki_url } = require('../../../../config.json');

const instance = axios.create({
  baseURL: wiki_url,
  timeout: 2500,
});

const requestData = async (argPage) => {
  // Depth restrict is wonky...
  const result = await instance.get('api.php?action=askargs&format=json&conditions=%1FKategorie%3AVolk%7C%2Bdepth%3D0%1F%3A%2B')
    .catch(() => null);

  if (typeof result.data.error !== 'undefined' || result.status !== 200 || typeof result.data.query.results === 'undefined' || result.data.query.results.length === 0) {
    return null;
  }

  return result.data.query.results;
};

module.exports = requestData;
