const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const { result, image, semantic } = data;

  return {
    timestamp: safeValueAccess('updated_at', result),
    name: safeValueAccess('name', result),

    length: safeValueAccess('sizes.length', result, 0),
    beam: safeValueAccess('sizes.beam', result, 0),
    height: safeValueAccess('sizes.height', result, 0),

    crew_max: safeValueAccess('crew.max', result, 0),
    crew_min: safeValueAccess('crew.min', result, 0),

    scm: safeValueAccess('speed.scm', result, 0),
    afterburner: safeValueAccess('speed.max', result, 0),

    mass: safeValueAccess('mass', result, 0),
    cargo: safeValueAccess('cargo_capacity', result, 0),
    vehicle_inventory: safeValueAccess('vehicle_inventory', result, 0),
    personal_inventory: safeValueAccess('personal_inventory', result, 0),
    foci: safeValueAccess('foci', result, []) ?? [],

    manufacturer: safeValueAccess('manufacturer.name', result, ''),
    manufacturer_code: safeValueAccess('manufacturer.code', result, ''),
    size: safeValueAccess('size', result, ''),
    status: safeValueAccess('production_status', result, ''),

    description: safeValueAccess('description', result, ''),

    image,

    price: safeValueAccess('Schiffspreis.0.value', semantic, 0, true),
    sources: safeValueAccess('Quelle', semantic, []),
  };
};

module.exports = createDTO;
