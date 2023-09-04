const axios = require('axios');
const { wiki_url } = require('../../../../config.json');

const instance = axios.create({
  baseURL: wiki_url,
  timeout: 2500,
});

const requestData = async (name) => {
  const result = await instance.get('/api.php', {
    params: {
      action: 'ask',
      query: `[[${name}]]|?foaf:knows#-=relatives|?Geburtsdatum|?Todesdatum|?Geschlecht|?Volk|?Quelle|?Modification date#-=timestamp`,
      format: 'json',
      formatversion: 2,
    },
  })
    .catch(() => null);

  if (typeof result?.data?.error !== 'undefined' || result.status !== 200 || typeof result?.data?.query?.results === 'undefined' || result?.data?.query?.results?.length === 0) {
    return null;
  }

  return result.data.query.results;
};

module.exports = requestData;
