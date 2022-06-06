const axios = require('../request');

const requestData = async (name) => {
  let uri = `/${encodeURIComponent(name.toLowerCase())}`;
  if (name.length === 0) {
    uri = '';
  }

  const apiData = await axios.get(`manufacturers${uri}`, {
    params: {
      include: 'ships,vehicles',
      limit: 0,
    },
  })
    .catch((error) => error);

  if (apiData.status !== 200) {
    throw apiData;
  }

  return apiData.data;
};

module.exports = requestData;
