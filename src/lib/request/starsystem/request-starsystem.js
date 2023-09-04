const axios = require('../request');

const requestData = async (name) => {
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
