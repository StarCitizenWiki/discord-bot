const axios = require('axios');
const { wiki_url } = require('../../../../config.json');

const instance = axios.create({
  baseURL: wiki_url,
  timeout: 2500,
});

const requestData = async (argPage) => {
  let page = 0;
  if (argPage !== null) {
    page = 10 * Math.abs(Number.parseInt(argPage, 10) - 1);
  }

  const result = await instance.get('/api.php', {
    params: {
      action: 'ask',
      query: `[[Kategorie:Persönlichkeit]][[:+]]|limit=20|offset=${page}`,
      format: 'json',
      formatversion: 2,
    },
  })
    .catch(() => null);

  if (typeof result?.data?.query?.results === 'undefined' || typeof result?.data?.error !== 'undefined' || result.status !== 200 || result.data.query.results.length === 0) {
    return null;
  }

  return result.data.query.results;
};

module.exports = requestData;
