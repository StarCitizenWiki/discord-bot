const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const dto = [];

  for (const nation in data) {
    if (!Object.prototype.hasOwnProperty.call(data, nation)) {
      return;
    }

    dto.push({
      name: safeValueAccess('fulltext', data[nation]),
      url: safeValueAccess('fullurl', data[nation], ''),
    });
  }

  return dto.filter((nation) => !nation.name.includes('/'));
};

module.exports = createDTO;
