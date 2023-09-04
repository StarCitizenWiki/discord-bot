const axios = require('../request');
const requestImage = require('../request-image');
const requestSemanticData = require('./request-vehicle-semantic-data');

/**
 * Mappings that try to catch common misspellings or names
 * Maps API name to an array of possible catches
 */
const nameMappings = {
  '600i touring': [
    '600i',
  ],
  'ares inferno': [
    'ares',
    'crusader ares inferno',
  ],
  'ares ion': [
    'crusader ares ion',
  ],
  'avenger stalker': [
    'stalker',
  ],
  'avenger titan': [
    'titan',
  ],
  'avenger titan renegade': [
    'titan renegade',
  ],
  'avenger warlock': [
    'warlock',
  ],
  'banu defender': [
    'defender',
  ],
  merchantman: [
    'banu merchantman',
  ],
  'constellation andromeda': [
    'andromeda',
  ],
  'constellation aquila': [
    'aquila',
  ],
  'constellation phoenix': [
    'phoenix',
  ],
  'constellation taurus': [
    'taurus',
  ],
  'cnou nomad': [
    'nomad',
  ],
  'idris-m': [
    'idris',
  ],
  mercury: [
    'mercury star runner',
    'mercury starrunner',
    'starrunner',
  ],
  mole: [
    'argo mole',
  ],
  'san\'tok.yāi': [
    'santokyai',
  ],
};

const requestData = async (name) => {
  name = name.replace('[', '').replace(']', '');

  Object.entries(nameMappings).every((mapping) => {
    if (mapping[1].includes(name.toLowerCase())) {
      name = mapping[0];

      return false;
    }

    return true;
  });

  let apiData = await axios.post('v2/vehicles/search?limit=1', {
    query: name.toLowerCase(),
  })
    .catch((error) => error);

  if (apiData.status !== 200) {
    throw apiData;
  }

  let result = apiData.data.data[0];

  apiData = await axios.get(`v2/vehicles/${result.uuid}`)
    .catch((error) => error);

  result = apiData.data.data;

  let semanticData = await requestSemanticData(result.name);

  const imageNames = [
    result.name,
    `${result.name} (Raumschiff)`,
  ];

  if (semanticData !== null) {
    semanticData = Object.entries(semanticData).filter((entry) => {
      if (typeof entry[1] === 'undefined') {
        return false;
      }

      const data = entry[1]?.printouts?.Quelle;

      return typeof data === 'object' && data.length > 0;
    });

    if (semanticData.length > 0) {
      imageNames.push(semanticData[0][0]);

      semanticData = semanticData[0][1].printouts;
    }
  }

  const image = await requestImage(imageNames.join('|'));

  return {
    result,
    image,
    semantic: semanticData,
  };
};

module.exports = requestData;
