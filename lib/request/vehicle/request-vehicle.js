const axios = require('../request')
const requestImage = require('../request-image')
const requestSemanticData = require('./request-vehicle-semantic-data')

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
  let semanticData = await requestSemanticData(result.data.name)

  if (typeof semanticData[result.data.name] === 'undefined') {
    semanticData = null
  } else {
    semanticData = semanticData[result.data.name].printouts
  }

  return {
    result: result.data,
    image,
    semantic: semanticData
  }
}

module.exports = requestData
