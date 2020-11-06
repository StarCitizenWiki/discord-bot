const requestStatusSystemData = require('../lib/request/status/request-status-services')
const requestStatusIncidentData = require('../lib/request/status/request-status-incidents')
const log = require('../lib/console-logger')
const safeValueAccess = require('../lib/safe-value-access')
const { database } = require('../lib/db')

const updateStatusSystems = async () => {
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

  statusData = statusData.reduce((data, system) => {
    data[system.name] = system.status

    return data
  }, {})

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

  if (incident === null) {
    await database.models.rsi_system_incidents.create({
      incident_id: safeValueAccess('0.id', incidentData, 'INVALID', true),
      title: safeValueAccess('0.title', incidentData, 'Undefined', true),
      incident_date: safeValueAccess('0.date', incidentData, Date.now(), true),
      updated_date: safeValueAccess('0.modified', incidentData, Date.now(), true),
      severity: safeValueAccess('0.severity', incidentData, 'undefined', true),
      affected_systems: JSON.stringify(safeValueAccess('0.affectedsystems', incidentData, '[]', true)),
      resolved: safeValueAccess('0.resolved', incidentData, false, true),
      content: safeValueAccess('0.content', incidentData, '', true).replace(/(<([^>]+)>)/ig, ''),
    })

    return
  }

  if ((new Date(incident.updated_date)).getTime() !== (new Date(safeValueAccess('0.modified', incidentData, new Date().getTime(), true)).getTime())) {
    await database.models.rsi_system_incidents.update({
      title: safeValueAccess('0.title', incidentData, 'Undefined', true),
      incident_date: safeValueAccess('0.date', incidentData, Date.now(), true),
      updated_date: safeValueAccess('0.modified', incidentData, Date.now(), true),
      severity: safeValueAccess('0.severity', incidentData, 'undefined', true),
      affected_systems: JSON.stringify(safeValueAccess('0.affectedsystems', incidentData, '[]', true)),
      resolved: safeValueAccess('0.resolved', incidentData, false, true),
      content: safeValueAccess('0.content', incidentData, '', true).replace(/(<([^>]+)>)/ig, ''),
    }, {
      where: {
        incident_id: safeValueAccess('0.id', incidentData, 'INVALID', true),
      }
    })

    await database.models.rsi_system_incidents_published.destroy({
      where: {
        incident_id: safeValueAccess('0.id', incidentData, 'INVALID', true),
      }
    })
  }
}

const execute = async () => {
  log('Executing Status Update Job')

  updateStatusSystems()
  updateIncidents()
}

module.exports = execute
