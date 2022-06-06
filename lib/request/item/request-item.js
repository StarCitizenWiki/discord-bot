const axios = require('../request');
const { locale } = require('../../../config.json');

const requestData = async (name) => {
  const apiData = await axios.get(`items/${encodeURIComponent(name.toLowerCase())}`, {
    params: {
      include: 'shops.items',
      locale,
    },
  })
    .catch((error) => error);

  if (apiData.status !== 200) {
    throw apiData;
  }

  const result = apiData.data;

  return {
    result: result.data,
  };
};

module.exports = requestData;
