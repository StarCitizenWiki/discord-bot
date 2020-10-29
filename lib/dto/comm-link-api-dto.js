const safeValueAccess = require('../safe-value-access')
const { wiki_url } = require('../../config.json')

const createDTO = (data) => {
  const dto = []

  for (const commLink of data) {
    dto.push({
      id: safeValueAccess('id', commLink, -1),
      title: safeValueAccess('title', commLink),
      rsiUrl: safeValueAccess('rsi_url', commLink),
      wikiUrl: `${wiki_url}/Comm-Link:${safeValueAccess('id', commLink, 0)}`,
      channel: safeValueAccess('channel', commLink),
      series: safeValueAccess('series', commLink),
      category: safeValueAccess('category', commLink),
      timestamp: safeValueAccess('created_at', commLink),
    })
  }

  return dto
}

module.exports = createDTO
