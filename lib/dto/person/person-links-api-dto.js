const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const dto = [];

  for (const person in data) {
    if (!Object.prototype.hasOwnProperty.call(data, person)) {
      return;
    }

    dto.push({
      name: safeValueAccess('fulltext', data[person]),
      url: safeValueAccess('fullurl', data[person], ''),
    });
  }

  return dto;
};

module.exports = createDTO;
