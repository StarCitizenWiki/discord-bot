const isNumeric = (datum) => {
  if (typeof datum !== 'string') {
    return false;
  }

  return !Number.isNaN(datum) && !Number.isNaN(parseFloat(datum));
};

module.exports = isNumeric;
