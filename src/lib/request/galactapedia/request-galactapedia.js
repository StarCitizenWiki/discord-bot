const axios = require('../request');
const { getApiLocale } = require('../../translate');

const requestData = async (args, interaction) => {
  const result = await axios.get(`v2/galactapedia/${encodeURIComponent(args.toLowerCase())}`, {
    params: {
      include: 'related_articles',
      locale: getApiLocale(interaction),
    },
  })
    .catch(() => null);

  if (typeof result?.data === 'undefined' || typeof result?.data?.error !== 'undefined' || result.status !== 200 || result.data.data.length === 0) {
    return null;
  }

  return result.data.data;
};

module.exports = requestData;
