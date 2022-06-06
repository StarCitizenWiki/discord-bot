const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const dto = {
    links: [],
    current: safeValueAccess('meta.pagination.current_page', data),
    total: safeValueAccess('meta.pagination.total_pages', data),
  };

  for (const vehicleLink of data.data) {
    dto.links.push({
      name: safeValueAccess('name', vehicleLink),
    });
  }

  return dto;
};

module.exports = createDTO;
