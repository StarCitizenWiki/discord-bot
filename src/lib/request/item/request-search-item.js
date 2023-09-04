const axios = require('../request');

const requestData = async (name) => {
  const apiData = await axios.post('v2/items/search', {
    query: name,
  })
    .catch((error) => error);

  if (apiData.status !== 200) {
    return {
      result: [],
    };
  }

  const result = apiData.data.data;

  return {
    result,
  };
};

module.exports = requestData;
