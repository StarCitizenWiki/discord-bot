const axios = require('./request');

const requestData = async () => {
  const apiData = await axios.get('v2/comm-links', {
    params: {
      limit: 25,
    },
  })
    .catch((error) => error);

  if (apiData.status !== 200) {
    throw apiData;
  }

  return apiData.data.data;
};

module.exports = requestData;
