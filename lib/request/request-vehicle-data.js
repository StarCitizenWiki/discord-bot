const axios = require('./request')
const requestImage = require('./request-image')
const createEmbed = require('../embed/vehicle-embed')
const createDTO = require('../dto/vehicle-api-dto')

const requestVehicleData = async (name, uri) => {
  const apiData = await axios.get(uri + '/' + encodeURIComponent(name))
    .catch(error => {
      return error
    })

  if (apiData.status !== 200) {
    throw apiData
  }

  const result = apiData.data
  const image = await requestImage(name)

  return createEmbed(createDTO(result.data, image))
}

module.exports = requestVehicleData
