const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const dto = [];

  for (const manufacturer in data) {
    if (!Object.prototype.hasOwnProperty.call(data, manufacturer)) {
      return;
    }

    dto.push({
      name: safeValueAccess('name', manufacturer),
      code: safeValueAccess('code', manufacturer),
    });
  }

  return dto;
};

module.exports = createDTO;
