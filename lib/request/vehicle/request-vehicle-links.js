const axios = require('../request');

const requestData = async (uri, argPage) => {
  let page = 0;
  if (argPage) {
    page = Math.abs(Number.parseInt(argPage, 10));
  }

  const apiData = await axios.get(uri, {
    params: {
      transformer: 'link',
      limit: 9,
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
