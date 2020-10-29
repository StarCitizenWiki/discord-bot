const requestData = require('../lib/request/request-comm-link-data')
const createDTO = require('../lib/dto/comm-link-api-dto')
const createEmbed = require('../lib/embed/comm-links-embed')

module.exports = {
  name: 'comm-link',
  aliases: ['cl'],
  description: 'Erzeugt eine Informationskarte zu den aktuellsten Comm-Links.',
  cooldown: 3,
  async execute (message) {
    const data = await requestData()

    message.channel.send(createEmbed(createDTO(data)))
  },
}
