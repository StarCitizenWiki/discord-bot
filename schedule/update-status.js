const requestStatusSystemData = require('../lib/request/status/request-status-services')
const requestStatusIncidentData = require('../lib/request/status/request-status-incidents')
const log = require('../lib/console-logger')
const safeValueAccess = require('../lib/safe-value-access')
const { database } = require('../lib/db')

/**
 * Compare two incidents by key
 *
 * @param {Object} dbIncident - Sequelize Database incident object
 * @param {Object} liveIncident - status.rsi Object
 * @returns {boolean}
 */
const incidentsEqual = (dbIncident, liveIncident) => {
  const keysToCompare = [
    'title',
    'severity',
    'affected_systems',
    'resolved',
    'content'
  ]

  return keysToCompare.reduce((equal, key) => {
    if (!Object.prototype.hasOwnProperty.call(dbIncident.dataValues, key)) {
      console.log(dbIncident)
      throw new Error(`Key ${key} does not exist on first incident`)
    }

    if (!Object.prototype.hasOwnProperty.call(liveIncident, key)) {
      console.log(liveIncident)
      throw new Error(`Key ${key} does not exist on second incident`)
    }

    let localEqual

    if (typeof dbIncident[key] === 'string') {
      localEqual = dbIncident[key].localeCompare(liveIncident[key]) === 0
    } else {
      localEqual = dbIncident[key] === liveIncident[key]
    }

    return equal && localEqual
  }, true)
}

/**
 * Update the system status for platform, pu, ea
 *
 * @returns {Promise<void>}
 */
const updateSystemsStatus = async () => {
  let statusData

  try {
    statusData = await requestStatusSystemData()
  } catch (e) {
    log(e, {}, 'error')

    return
  }

  if (typeof statusData === 'undefined') {
    return
  }

  statusData = statusData.filter(status => status !== null).reduce((data, system) => {
    data[system.name] = system.status

    return data
  }, {
    platform: 'operational',
    pu: 'operational',
    ea: 'operational',
  })

  const status = await database.models.rsi_system_status.findOne({
    order: [
      ['createdAt', 'DESC']
    ]
  })

  if (status === null ||
    statusData.platform !== status.platform ||
    statusData.pu !== status.pu ||
    statusData.ea !== status.ea
  ) {
    await database.models.rsi_system_status.create(statusData)
  }
}

/**
 * Update / Create incidents
 * Creates an incident if the id does not exist in the db
 * Updates an incident if some keys differ
 * @see {incidentsEqual}
 *
 * @returns {Promise<void>}
 */
const updateIncidents = async () => {
  let incidentData

  try {
    incidentData = await requestStatusIncidentData()
  } catch (e) {
    log(e, {}, 'error')

    return
  }

  if (typeof incidentData === 'undefined' || typeof incidentData[0] === 'undefined') {
    log('No Incidents found', {}, 'error')

    return
  }

  const incident = await database.models.rsi_system_incidents.findOne({
    where: {
      incident_id: incidentData[0].id
    }
  })

  const liveIncident = {
    incident_id: safeValueAccess('0.id', incidentData, 'INVALID', true),
    title: safeValueAccess('0.title', incidentData, 'Undefined', true),
    incident_date: safeValueAccess('0.date', incidentData, Date.now(), true),
    updated_date: safeValueAccess('0.modified', incidentData, Date.now(), true),
    severity: safeValueAccess('0.severity', incidentData, 'undefined', true),
    affected_systems: JSON.stringify(safeValueAccess('0.affectedsystems', incidentData, '[]', true)),
    resolved: safeValueAccess('0.resolved', incidentData, false, true),
    content: safeValueAccess('0.content', incidentData, '', true).replace(/(<([^>]+)>)/ig, ''),
  }

  if (incident === null) {
    await database.models.rsi_system_incidents.create(liveIncident)

    return
  }

  if (!incidentsEqual(incident, liveIncident)) {
    await database.models.rsi_system_incidents.update(liveIncident, {
      where: {
        incident_id: liveIncident.incident_id,
      }
    })

    await database.models.rsi_system_incidents_published.destroy({
      where: {
        incident_id: liveIncident.incident_id,
      }
    })
  }
}

const execute = async () => {
  log('Executing Status Update Job')

  return Promise.all([
    updateSystemsStatus(),
    updateIncidents()
  ])
}

module.exports = execute
