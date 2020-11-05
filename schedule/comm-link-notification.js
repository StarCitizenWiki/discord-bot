const requestData = require('../lib/request/request-comm-link-data')
const createDTO = require('../lib/dto/comm-link-api-dto')
const createEmbed = require('../lib/embed/comm-links-embed')
const log = require('../lib/console-logger')

const execute = async () => {
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

  const dataIds = data.map(commLink => commLink.id)

  let publishedIds = await global.keyv.get('cl_id')

  if (typeof publishedIds === 'undefined' || typeof publishedIds === 'number') {
    await global.keyv.set('cl_id', dataIds)

    return
  }

  data = data.filter(commLink => !publishedIds.includes(commLink.id))
  const filteredIds = data.map(commLink => commLink.id)

  if (data.length === 0) {
    return
  }

  publishedIds.push(...filteredIds)

  log(`Found ${filteredIds.length} new Comm-Links`, filteredIds)

  if (publishedIds.length > 50) {
    publishedIds = publishedIds.slice(publishedIds.length - 50)
  }

  await global.keyv.set('cl_id', publishedIds)

  const embed = createEmbed(data)

  if (embed.fields.length === 0) {
    return
  }

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
}

module.exports = execute
