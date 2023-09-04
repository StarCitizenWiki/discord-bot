const axios = require('../request');
const { locale } = require('../../../../config.json');

const requestData = async (args) => {
  const result = await axios.get(`v2/galactapedia/${encodeURIComponent(args.toLowerCase())}`, {
    params: {
      include: 'related_articles',
      locale,
    },
  })
    .catch(() => null);

  if (typeof result?.data === 'undefined' || typeof result?.data?.error !== 'undefined' || result.status !== 200 || result.data.data.length === 0) {
    return null;
  }

  return result.data.data;
};

module.exports = requestData;
