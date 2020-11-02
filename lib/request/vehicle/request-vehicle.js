const axios = require('../request')
const requestImage = require('../request-image')

const requestData = async (name, uri) => {
  const apiData = await axios.get(uri + '/' + encodeURIComponent(name.toLowerCase()))
    .catch(error => {
      return error
    })

  if (apiData.status !== 200) {
    throw apiData
  }

  const result = apiData.data
  const image = await requestImage(result.data.name)

  return {
    result: result.data,
    image
  }
}

module.exports = requestData
