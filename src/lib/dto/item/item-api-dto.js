const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const { result, image } = data;

  return {
    name: safeValueAccess('name', result),

    timestamp: safeValueAccess('updated_at', result, ''),

    type: safeValueAccess('type', result, ''),
    manufacturer: safeValueAccess('manufacturer.name', result, ''),

    description: safeValueAccess('specification.description', result, ''),

    shops: safeValueAccess('shops', result, []),

    image,
  };
};

module.exports = createDTO;
