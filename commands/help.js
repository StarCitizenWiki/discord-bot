const createdEmbed = require('../lib/embed/help-embed')
const { prefix } = require('../config.json')

module.exports = {
  name: 'hilfe',
  description: 'Alle Befehle oder Informationen über einen bestimmten Befehl auflisten.',
  description_extended: `\`$PREFIXhilfe\` - Anzeige der Hilfeseite`,
  aliases: ['help', 'commands'],
  usage: 'Befehlsname',
  cooldown: 5,
  async execute (message, args) {
    const { commands } = message.client

    if (!args.length) {
      let reply = `Dies sind alle verfügbaren Befehle:\nDu kannst \`${prefix}${this.name} [Befehl]\` schreiben, um Informationen zu einem spezifischen Befehl zu erhalten.\n\n`

      commands.map(command => {
        if (typeof command.description_extended === 'undefined') {
          return command.description
        }

        return command.description_extended.replaceAll('$PREFIX', prefix)
      }).forEach(description => {
        reply += `${description}\n\n`
      })

      return message.author.send(reply)
        .then(() => {
          if (message.channel.type === 'dm') {
            return
          }
          message.reply('Ich habe dir eine Nachricht mit all meinen Befehlen geschickt!')
        })
        .catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
          message.reply('Es scheint, als könnte ich dir keine Nachricht senden...')
        })
    }

    const name = args[0].toLowerCase()
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

    if (!command) {
      return message.reply('Das ist kein valider Befehl!')
    }

    message.channel.send(createdEmbed(command))
  },
}
