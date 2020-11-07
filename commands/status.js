const { database } = require('../lib/db')

const createStatusEmbed = require('../lib/embed/status/status-services-embed')
const createIncidentEmbed = require('../lib/embed/status/status-incident-embed')
const manageChannelNotification = require('../lib/manage-channel-notification')

module.exports = {
  name: 'status',
  description: 'Erzeugt eine Informationskarte zu dem aktuellen RSI Systemstatus.',
  description_short: `\`$PREFIXstatus\` - Anzeige des aktuellen Systemstatus\n\`$PREFIXstatus latest\` - Anzeige des letzten Vorfalls\n\`$PREFIXstatus add\` - Hinzufügen des aktuellen Kanals zu Benachrichtigungen\n\`$PREFIXstatus remove\` - Entfernen des aktuellen Kanals von Benachrichtigungen`,
  cooldown: 3,
  examples: [
    `Ausgabe des aktuellen Systemstatus: \`$PREFIXstatus\``,
    `Ausgabe des letzten Vorfalls: \`$PREFIXstatus neueste\``,
    `Hinzufügen des aktuellen Kanals zu Benachrichtigungen: \`$PREFIXstatus add\``,
    `Entfernen des aktuellen Kanals für Benachrichtigungen: \`$PREFIXstatus remove\``,
  ],
  async execute (message, args) {
    if (!args.length) {
      const data = await database.models.rsi_system_status.findOne({
        order: [
          ['createdAt', 'DESC']
        ]
      })

      return message.channel.send(createStatusEmbed(data))
    }

    if (typeof args[0] !== 'string') {
      return
    }

    switch (args[0]) {
      case 'latest':
      case 'neueste':
        const data = await database.models.rsi_system_incidents.findOne({
          order: [
            ['createdAt', 'DESC']
          ]
        })

        return message.channel.send(createIncidentEmbed(data))

      case 'hinzufügen':
      case 'add':
      case 'entfernen':
      case 'remove':
        try {
          await manageChannelNotification(message, args, 'incident_notification_channel', 'Systemstatus')
        } catch (e) {
          console.error(e)
        }
    }
  },
}
