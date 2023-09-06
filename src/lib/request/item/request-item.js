const axios = require('../request');
const { locale } = require('../../../../config.json');
const requestImage = require('../request-image');
const { getApiLocale } = require('../../translate');

const requestData = async (interaction) => {
  const name = interaction.options.getString('name');

  const apiData = await axios.get(`v2/items/${encodeURIComponent(name.toLowerCase())}`, {
    params: {
      include: 'shops.items',
      locale: getApiLocale(interaction),
    },
  })
    .catch((error) => error);

  if (apiData.status !== 200) {
    throw apiData;
  }

  const result = apiData.data;

  const image = await requestImage(result.data.name);

  return {
    result: result.data,
    image,
  };
};

module.exports = requestData;
