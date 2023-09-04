const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const dto = {
    links: [],
    current: safeValueAccess('meta.current_page', data),
    total: safeValueAccess('meta.last_page', data),
  };

  for (const vehicleLink of data.data) {
    dto.links.push({
      name: safeValueAccess('name', vehicleLink),
    });
  }

  return dto;
};

module.exports = createDTO;
