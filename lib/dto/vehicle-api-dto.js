const safeValueAccess = require('../safe-value-access')

const createDTO = (data, image) => {
  return {
    timestamp: safeValueAccess('updated_at', data),
    name: safeValueAccess('name', data),

    length: safeValueAccess('sizes.length', data, 0),
    beam: safeValueAccess('sizes.beam', data, 0),
    height: safeValueAccess('sizes.height', data, 0),

    crew_max: safeValueAccess('crew.max', data, 0),

    scm: safeValueAccess('speed.scm', data, 0),
    afterburner: safeValueAccess('speed.afterburner', data, 0),

    mass: safeValueAccess('mass', data, 0),
    cargo: safeValueAccess('cargo_capacity', data, 0),
    foci: safeValueAccess('foci', data, []) ?? [],

    manufacturer: safeValueAccess('manufacturer.name', data, ''),
    size: safeValueAccess('size', data, ''),
    status: safeValueAccess('production_status', data, ''),

    description: safeValueAccess('description', data, ''),

    image,
  }
}

module.exports = createDTO
