const { Permissions } = require('discord.js')
const requestData = require('../lib/request/request-comm-link-data')
const createDTO = require('../lib/dto/comm-link-api-dto')
const createEmbed = require('../lib/embed/comm-links-embed')
const { database } = require('../lib/db')

module.exports = {
  name: 'comm-link',
  aliases: ['cl', 'comm-links'],
  description: 'Erzeugt eine Informationskarte zu den aktuellsten Comm-Links.\nOder fügt einen Kanal als Benachrichtigungskanal für neue Comm-Links hinzu.',
  description_short: `\`$PREFIXcomm-link\` - Auflistung der aktuellen Comm-Links\n\`$PREFIXcomm-link add\` - Hinzufügen des aktuellen Kanals zu Benachrichtigungen\n\`$PREFIXcomm-link remove\` - Entfernen des aktuellen Kanals von Benachrichtigungen`,
  cooldown: 3,
  examples: [
    `Ausgabe der neuesten Comm-Links: \`$PREFIXcl\``,
    `Hinzufügen des aktuellen Kanals zu Benachrichtigungen: \`$PREFIXcl add\``,
    `Entfernen des aktuellen Kanals für Benachrichtigungen: \`$PREFIXcl remove\``,
  ],
  async execute (message, args) {
    if (typeof args !== 'undefined' && args.length > 0) {
      if (!message.guild || !message.guild.available) {
        return message.channel.send('Kann nur Serverchannel benachrichtigen.')
      }

      const user = message.guild.member(message.author)
      if (!user.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) {
        return message.channel.send('Nur Administratoren können Benachrichtigungen aktivieren.')
      }

      switch (args[0]) {
        case 'hinzufügen':
        case 'add':
          const findResult = await database.models.cl_notification_channel.findOne({
            where: { channel_id: message.channel.id }
          })

          if (!findResult) {
            await database.models.cl_notification_channel.create({
              guild_id: message.guild.id,
              channel_id: message.channel.id,
            })
          } else {
            return message.channel.send('Automatische Comm-Link Benachrichtigungen sind bereits aktiviert.')
          }

          return message.channel.send('Automatische Comm-Link Benachrichtigung aktiviert.')

        case 'entfernen':
        case 'remove':
          const destroyResult = await database.models.cl_notification_channel.destroy({
            where: { channel_id: message.channel.id }
          })

          if (!destroyResult) {
            return message.channel.send('Automatische Comm-Link Benachrichtigungen sind für diesen Kanal nicht aktiviert.')
          }

          return message.channel.send('Automatische Comm-Link Benachrichtigung deaktiviert.')

        default:
          return message.channel.send('Option war weder `add` noch `remove`.')
      }
    }

    const data = await requestData()
    let dto = createDTO(data)
    dto = dto.slice(0, 10)

    message.channel.send(createEmbed(dto))
  },
}
