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
  const image = await requestImage(`${result.data.name}|${result.data.name} (Raumschiff)`)
  let semanticData = await requestSemanticData(result.data.name)

  if (semanticData !== null) {
    semanticData = Object.entries(semanticData).filter(entry => {
      if (typeof entry[1] === 'undefined') {
        return false
      }

      const data = entry[1]?.printouts?.Quelle

      return typeof data === 'object' && data.length > 0
    })

    semanticData = semanticData[0][1].printouts
  }

  return {
    result: result.data,
    image,
    semantic: semanticData
  }
}

module.exports = requestData
