const safeValueAccess = require('../../safe-value-access');

const createDTO = (data) => {
  const relatives = safeValueAccess('printouts.relatives', data, ['-']).map((relative) => relative.fulltext);

  return {
    timestamp: safeValueAccess(
      '0.timestamp',
      safeValueAccess('printouts.timestamp', data, 0, false),
      0,
      true,
    ),

    name: safeValueAccess('fulltext', data),
    url: safeValueAccess('fullurl', data),

    relatives,

    birth: safeValueAccess(
      '0.timestamp',
      safeValueAccess('printouts.Geburtsdatum', data, 0, false),
      0,
      true,
    ),
    death: safeValueAccess(
      '0.timestamp',
      safeValueAccess('printouts.Todesdatum', data, 0, false),
      0,
      true,
    ),

    gender: safeValueAccess(
      '0',
      safeValueAccess('printouts.Geschlecht', data, 0, false),
      '-',
      true,
    ),

    nation: safeValueAccess(
      '0.fulltext',
      safeValueAccess('printouts.Volk', data, 0, false),
      '-',
      true,
    ),

    sources: safeValueAccess('printouts.Quelle', data, []),
  };
};

module.exports = createDTO;
