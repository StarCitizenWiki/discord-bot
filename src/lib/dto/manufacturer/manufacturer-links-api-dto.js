const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const dto = [];

  for (const manufacturer of data) {
    dto.push({
      name: safeValueAccess('name', manufacturer),
      code: safeValueAccess('code', manufacturer),
    });
  }

  return dto;
};

module.exports = createDTO;
