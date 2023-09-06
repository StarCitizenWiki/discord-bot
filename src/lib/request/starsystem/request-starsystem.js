const axios = require('../request');

const requestData = async (interaction) => {
  const name = interaction.options.getString('name');

  const apiData = await axios.get(`starmap/starsystems/${encodeURIComponent(name.toLowerCase())}`, {
    params: {
      include: 'celestial_objects,jumppoints',
    },
  })
    .catch((error) => error);

  if (apiData.status !== 200) {
    throw apiData;
  }

  return apiData.data;
};

module.exports = requestData;
