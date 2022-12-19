const axios = require('../request');

const requestData = async (name) => {
  const apiData = await axios.post('vehicles/search', {
    query: name,
  })
      .catch((error) => error);

  if (apiData.status !== 200) {
    return {
      result: [],
    };
  }

  const result = apiData.data;

  return {
    result: result.data,
  };
};

module.exports = requestData;
