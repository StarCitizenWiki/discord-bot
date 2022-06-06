const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const { result, image } = data;

  return {
    name: safeValueAccess('name', result),

    timestamp: safeValueAccess('specification.data.updated_at', result, ''),

    type: safeValueAccess('type', result, ''),
    manufacturer: safeValueAccess('manufacturer', result, ''),

    description: safeValueAccess('specification.data.description', result, ''),

    shops: safeValueAccess('shops.data', result, []),

    image
  };
};

module.exports = createDTO;
