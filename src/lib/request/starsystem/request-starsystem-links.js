const axios = require('../request');

const requestData = async (interaction) => {
  const argPage = interaction.options.getInteger('seite');
  let page = 0;
  if (argPage) {
    page = Math.abs(Number.parseInt(argPage, 10));
  }

  const apiData = await axios.get('starmap/starsystems', {
    params: {
      transformer: 'link',
      limit: 25,
      page,
    },
  })
    .catch((error) => error);

  if (apiData.status !== 200) {
    throw apiData;
  }

  return apiData.data;
};

module.exports = requestData;
