const getSystemName = (name) => {
  switch (name) {
    case 'platform':
      return 'Plattform'

    case 'pu':
      return 'Persistent Universe'

    case 'ea':
      return 'Electronic Access'

    default:
      return name
  }
}

const getStatusName = (name) => {
  switch (name) {
    case 'operational':
      return 'Funktionsfähig'

    case 'under-maintenance':
      return 'Wartung'

    case 'major-outage':
      return 'Großausfall'

    case 'partial-outage':
      return 'Teilweiser Ausfall'

    case 'degraded-performance':
      return 'Verminderte Leistung'

    default:
      return name
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'operational':
      return ':white_check_mark:'

    case 'under-maintenance':
      return ':wrench:'

    case 'major-outage':
      return ':rotating_light:'

    case 'partial-outage':
      return ':x:'

    case 'degraded-performance':
      return ':warning:'

    default:
      return ':question:'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'major-outage':
      return '#ff0000'

    case 'partial-outage':
      return '#ff4500'

    case 'under-maintenance':
      return '#ffa500'

    case 'degraded-performance':
      return '#ffff00'

    case 'operational':
      return '#008000'

    default:
      return ''
  }
}

const formatDescription = (description) => {
  return description
    .split('[')
    .join("\n[")
}

module.exports = {
  getSystemName,
  getStatusName,
  getStatusIcon,
  getStatusColor,
  formatDescription,
}
