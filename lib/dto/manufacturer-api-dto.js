const safeValueAccess = require('../safe-value-access')

const createDTO = (data, image) => {
  return {
    timestamp: safeValueAccess('updated_at', data),
    name: safeValueAccess('name', data),
    code: safeValueAccess('code', data),

    known_for: safeValueAccess('known_for', data, '-'),
    description: safeValueAccess('description', data, ''),

    ships: safeValueAccess('ships.data', data, []),
    vehicles: safeValueAccess('vehicles.data', data, []),

    image,
  }
}

module.exports = createDTO
