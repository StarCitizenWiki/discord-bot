const axios = require('../request');

const requestData = async (name) => {
  const apiData = await axios.post('v2/vehicles/search', {
    query: name,
  })
    .catch((error) => error);
  console.log(apiData);
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
