const logger = async (text, options = [], level = 'log') => {
  const ts = `[${(new Date()).toISOString()}]`

  if (Object.prototype.hasOwnProperty.call(console, level)) {
    console[level](`${ts} ${text}. ${JSON.stringify(options)}`)
  }
}

module.exports = logger
