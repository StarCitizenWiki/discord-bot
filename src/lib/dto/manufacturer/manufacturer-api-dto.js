const safeValueAccess = require('../../safe-value-access');

const createDTO = (data, image) => ({
  timestamp: safeValueAccess('meta.processed_at', data),
  name: safeValueAccess('name', data),
  code: safeValueAccess('code', data),

  known_for: safeValueAccess('known_for', data, '-'),
  description: safeValueAccess('description', data, ''),

  ships: safeValueAccess('ships', data, []),
  vehicles: safeValueAccess('vehicles', data, []),
  items: safeValueAccess('items', data, []),

  image,
});

module.exports = createDTO;
