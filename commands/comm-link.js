const requestData = require('../lib/request/request-comm-link-data')
const createDTO = require('../lib/dto/comm-link-api-dto')
const createEmbed = require('../lib/embed/comm-links-embed')

module.exports = {
  name: 'comm-link',
  aliases: ['cl'],
  description: 'Erzeugt eine Informationskarte zu den aktuellsten Comm-Links.\nOder fügt einen Kanal als Benachrichtigungskanal für neue Comm-Links hinzu.',
  cooldown: 3,
  examples: [
    `Ausgabe der neuesten Comm-Links: \`$PREFIXcl\``,
    `Hinzufügen des aktuellen Kanals zu Benachrichtigungen: \`$PREFIXcl add\``,
    `Entfernen des aktuellen Kanals für Benachrichtigungen: \`$PREFIXcl remove\``,
  ],
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
          return message.channel.send('Automatische Comm-Link Benachrichtigungen sind bereits aktiviert.')
        }

        await global.keyv.set('cl_channels', channel)

        return message.channel.send('Automatische Comm-Link Benachrichtigung aktiviert.')
      }

      if (args[0] === 'remove') {
        if (!message.guild) {
          return message.channel.send('Kann nur Serverchannel benachrichtigen.')
        }

        if (!channel.includes(message.channel.id)) {
          return message.channel.send('Automatische Comm-Link Benachrichtigungen sind für diesen Kanal nicht aktiviert.')
        }

        channel = channel.filter(id => id !== message.channel.id)

        await global.keyv.set('cl_channels', channel)

        return message.channel.send('Automatische Comm-Link Benachrichtigung deaktiviert.')
      }

      return message.channel.send('Option war weder `add` noch `remove`.')
    }

    const data = await requestData()

    message.channel.send(createEmbed(createDTO(data)))
  },
}
