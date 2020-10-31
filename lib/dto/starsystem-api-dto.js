const safeValueAccess = require('../safe-value-access')

const createDTO = (data, image) => {
  const dto = {
    timestamp: safeValueAccess('time_modified', data),
    name: safeValueAccess('name', data),

    size: safeValueAccess('aggregated.size', data, 0),
    status: safeValueAccess('status', data, ''),

    population: safeValueAccess('aggregated.population', data, 0),
    economy: safeValueAccess('aggregated.economy', data, 0),
    danger: safeValueAccess('aggregated.danger', data, 0),

    description: safeValueAccess('description', data, ''),

    image,
  }

  const affiliation = safeValueAccess('affiliation.data', data)

  if (affiliation !== null && typeof affiliation[0] !== 'undefined') {
    dto.affiliation = affiliation[0].name
    dto.color = affiliation[0].color
  }

  const celestialObjects = safeValueAccess('celestial_objects.data', data)

  const counts = {
    'STAR': 0,
    'JUMPPOINT': 0,
    'PLANET': 0,
    'MANMADE': 0,
  }

  if (celestialObjects !== null && celestialObjects.length > 0) {
    celestialObjects.forEach(object => {
      if (Object.prototype.hasOwnProperty.call(counts, object.type)) {
        counts[object.type]++
      }
    })
  }

  dto.stars_count = counts.STAR
  dto.planets_count = counts.PLANET
  dto.stations_count = counts.MANMADE
  dto.jumppoints_count = counts.JUMPPOINT

  const jumppoints = safeValueAccess('jumppoints.data', data)

  const destinations = []

  if (jumppoints !== null && jumppoints.length > 0) {
    jumppoints.forEach(jumppoint => {
      const entry_system_id = safeValueAccess('entry.system_id', jumppoint)
      const exit_system_id = safeValueAccess('exit.system_id', jumppoint)
      let designation = ''

      if (entry_system_id !== null && entry_system_id === data.id) {
        designation = safeValueAccess('entry.designation', jumppoint, '')
      } else if (exit_system_id !== null && exit_system_id === data.id) {
        designation = safeValueAccess('exit.designation', jumppoint, '')
      }

      const split = designation.split(' - ')
      if (split.length === 2) {
        destinations.push(split[1].trim())
      }
    })
  }

  dto.jumppoints = destinations

  return dto
}

module.exports = createDTO
