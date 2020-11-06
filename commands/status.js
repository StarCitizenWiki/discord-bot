const { database } = require('../lib/db')
const { Permissions } = require('discord.js')

const createStatusEmbed = require('../lib/embed/status/status-services-embed')
const createIncidentEmbed = require('../lib/embed/status/status-incident-embed')

module.exports = {
  name: 'status',
  //aliases: ['statistik', 'statistiken'],
  description: 'Erzeugt eine Informationskarte zu dem aktuellen RSI Systemstatus.',
  description_short: `\`$PREFIXstatus\` - Anzeige des aktuellen Systemstatus\n\`$PREFIXstatus neueste\` - Anzeige des letzten Vorfalls\n\`$PREFIXstatus add\` - Hinzufügen des aktuellen Kanals zu Benachrichtigungen\n\`$PREFIXstatus remove\` - Entfernen des aktuellen Kanals von Benachrichtigungen`,
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

    if (typeof args[0] === 'string') {
      let user
      if (typeof message.guild !== 'undefined' && message.guild.available) {
        user = message.guild.member(message.author)
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
          if (typeof user === 'undefined' || !user.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.channel.send('Nur Administratoren können Benachrichtigungen verwalten.')
          }

          const findResult = await database.models.incident_notification_channel.findOne({
            where: { channel_id: message.channel.id }
          })

          if (!findResult) {
            await database.models.incident_notification_channel.create({
              guild_id: message.guild.id,
              channel_id: message.channel.id,
            })
          } else {
            return message.channel.send('Automatische Systemstatus Benachrichtigungen sind bereits aktiviert.')
          }

          return message.channel.send('Automatische Systemstatus Benachrichtigung aktiviert.')

        case 'entfernen':
        case 'remove':
          if (typeof user === 'undefined' || !user.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.channel.send('Nur Administratoren können Benachrichtigungen verwalten.')
          }

          const destroyResult = await database.models.incident_notification_channel.destroy({
            where: { channel_id: message.channel.id }
          })

          if (!destroyResult) {
            return message.channel.send('Automatische Systemstatus Benachrichtigungen sind für diesen Kanal nicht aktiviert.')
          }

          return message.channel.send('Automatische Systemstatus Benachrichtigung deaktiviert.')
      }
    }
  },
}
