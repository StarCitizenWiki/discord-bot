const requestData = require('../lib/request/request-comm-link-data')
const createDTO = require('../lib/dto/comm-link-api-dto')
const createEmbed = require('../lib/embed/comm-links-embed')
const log = require('../lib/console-logger')

module.exports = {
  async execute () {
    log('Executing Comm-Link Notification Job')

    let data

    try {
      data = createDTO(await requestData())
    } catch (e) {
      log(e, {}, 'error')

      return
    }

    if (typeof data === 'undefined') {
      return
    }

    const latestId = await global.keyv.get('cl_id')

    if (typeof latestId === 'undefined') {
      await global.keyv.set('cl_id', data[0].id)

      return
    }

    data = data.filter(commLink => commLink.id > latestId)

    if (data.length === 0) {
      return
    }

    const maxId = data.sort((a, b) => {
      return b.id - a.id
    }).shift()

    if (typeof maxId !== 'undefined') {
      await global.keyv.set('cl_id', maxId.id)
    }

    const embed = createEmbed(data)

    let channelIds = await global.keyv.get('cl_channels')
    const errors = []

    log(`Sending messages to ${channelIds.length} channels`)

    channelIds.forEach(channelId => {
      const channel = global.client.channels.cache.get(channelId)
      channel.send(embed)
        .catch(() => {
          errors.push(channelId)
        })
    })

    if (errors.length > 0) {
      channelIds = channelIds.filter(id => !errors.includes(id))

      await global.keyv.set('cl_channels', channelIds)
    }
  },
}
