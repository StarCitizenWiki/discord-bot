const requestData = require('../lib/request/request-comm-link-data')
const createDTO = require('../lib/dto/comm-link-api-dto')
const createEmbed = require('../lib/embed/comm-links-embed')
const manageChannelNotification = require('../lib/manage-channel-notification')

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
      try {
        return manageChannelNotification(message, args, 'cl_notification_channel', 'Comm-Link')
      } catch (e) {
        console.error(e)
      }
    }

    const data = await requestData()
    let dto = createDTO(data)
    dto = dto.slice(0, 10)

    message.channel.send(createEmbed(dto))
  },
}
