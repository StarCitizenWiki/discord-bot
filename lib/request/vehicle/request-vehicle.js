const axios = require('../request')
const requestImage = require('../request-image')
const requestSemanticData = require('./request-vehicle-semantic-data')

/**
 * Mappings that try to catch common miss spellings or names
 * Maps API name to an array of possible catches
 */
const nameMappings = {
  '600i touring': [
    '600i'
  ],
  'argo mole': [
    'mole'
  ],
  'banu defender': [
    'defender'
  ],
  'constellation andromeda': [
    'andromeda'
  ],
  'constellation aquila': [
    'aquila'
  ],
  'constellation phoenix': [
    'phoenix'
  ],
  'constellation taurus': [
    'taurus'
  ],
  'cnou nomad': [
    'nomad'
  ],
  'crusader ares inferno': [
    'ares',
    'ares inferno'
  ],
  'crusader ares ion': [
    'ares ion'
  ],
  'idris-m': [
    'idris'
  ],
  'mercury star runner': [
    'mercury',
    'mercury starrunner',
    'starrunner',
  ],
  'san\'tok.yāi': [
    'santokyai'
  ]
}

const requestData = async (name, uri) => {
  name = name.replace('[', '').replace(']', '')

  Object.entries(nameMappings).every(mapping => {
    if (mapping[1].includes(name.toLowerCase())) {
      name = mapping[0]

      return false
    }

    return true
  })

  const apiData = await axios.get(uri + '/' + encodeURIComponent(name.toLowerCase()))
    .catch(error => {
      return error
    })

  if (apiData.status !== 200) {
    throw apiData
  }

  const result = apiData.data
  let semanticData = await requestSemanticData(result.data.name)

  let imageNames = [
    result.data.name,
    `${result.data.name} (Raumschiff)`
  ]

  if (semanticData !== null) {
    semanticData = Object.entries(semanticData).filter(entry => {
      if (typeof entry[1] === 'undefined') {
        return false
      }

      const data = entry[1]?.printouts?.Quelle

      return typeof data === 'object' && data.length > 0
    })

    imageNames.push(semanticData[0][0])

    semanticData = semanticData[0][1].printouts
  }

  const image = await requestImage(imageNames.join('|'))

  return {
    result: result.data,
    image,
    semantic: semanticData
  }
}

module.exports = requestData
