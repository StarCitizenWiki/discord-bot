const getStatusIcon = (status) => {
  switch (status) {
    case 'operational':
      return ':white_check_mark:';

    case 'under-maintenance':
      return ':wrench:';

    case 'major-outage':
      return ':rotating_light:';

    case 'partial-outage':
      return ':x:';

    case 'degraded-performance':
      return ':warning:';

    default:
      return ':question:';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'major-outage':
      return '#ff0000';

    case 'partial-outage':
      return '#ff4500';

    case 'under-maintenance':
      return '#ffa500';

    case 'degraded-performance':
      return '#ffff00';

    case 'operational':
      return '#008000';

    default:
      return 'DEFAULT';
  }
};

const formatDescription = (description) => description
  .split('[')
  .join('\n[');

module.exports = {
  getStatusIcon,
  getStatusColor,
  formatDescription,
};
