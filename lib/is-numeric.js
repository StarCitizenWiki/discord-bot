const isNumeric = (datum) => {
  if (typeof datum !== 'string') {
    return false
  }

  return !isNaN(datum) && !isNaN(parseFloat(datum))
}

module.exports = isNumeric
