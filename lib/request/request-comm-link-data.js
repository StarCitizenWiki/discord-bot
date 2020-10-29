const axios = require('./request')

const requestData = async () => {
  const apiData = await axios.get('comm-links', {
    params: {
      limit: 10
    }
  })
    .catch(error => {
      return error
    })

  if (apiData.status !== 200) {
    throw apiData
  }

  return apiData.data.data
}

module.exports = requestData
