const requestData = require('../lib/request/request-comm-link-data')
const createDTO = require('../lib/dto/comm-link-api-dto')
const createEmbed = require('../lib/embed/comm-links-embed')

module.exports = {
  name: 'comm-link',
  aliases: ['cl'],
  description: 'Erzeugt eine Informationskarte zu den aktuellsten Comm-Links.',
  cooldown: 3,
  async execute (message, args) {
    if (typeof args !== 'undefined' && args.length > 0) {
      let channel = await global.keyv.get('cl_channels')

      if (typeof channel === 'undefined') {
        channel = []
        await global.keyv.set('cl_channels', channel)
      }

      if (args[0] === 'add') {
        if (!message.guild) {
          return message.channel.send('Kann nur Serverchannel benachrichtigen.')
        }

        if (!channel.includes(message.channel.id)) {
          channel.push(message.channel.id)
        } else {
          return message.channel.send('Benachrichtigungschannel bereits hinzugefügt.')
        }

        await global.keyv.set('cl_channels', channel)

        return message.channel.send('Benachrichtigungschannel hinzugefügt.')
      }

      if (args[0] === 'remove') {
        if (!message.guild) {
          return message.channel.send('Kann nur Serverchannel benachrichtigen.')
        }

        if (!channel.includes(message.channel.id)) {
          return message.channel.send('Channel ist nicht abonniert.')
        }

        channel = channel.filter(id => id !== message.channel.id)

        await global.keyv.set('cl_channels', channel)

        return message.channel.send('Benachrichtigungschannel entfernt.')
      }

      return message.channel.send('Option war weder `add` noch `remove`.')
    }

    const data = await requestData()

    message.channel.send(createEmbed(createDTO(data)))
  },
}
