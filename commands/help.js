const { prefix } = require('../config.json')

module.exports = {
  name: 'help',
  description: 'Alle Befehle oder Informationen über einen bestimmten Befehl auflisten.',
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  async execute (message, args) {
    const data = []
    const { commands } = message.client

    if (!args.length) {
      data.push('Dies sind alle verfügbaren Befehle:')
      data.push(commands.map(command => command.name).join(', '))
      data.push(`\nDu kannst \`${prefix}help [Befehl]\` schreiben, um Informationen zu einem spezifischen Befehl zu erhalten.`)

      return message.author.send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return
          message.reply('Ich habe dir ein Nachricht mit all meinen Befehlen geschickt!')
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

    data.push(`**Name:** ${command.name}`)

    if (command.aliases) {
      data.push(`**Aliasse:** ${command.aliases.join(', ')}`);
    }

    if (command.description) {
      data.push(`**Beschreibung:** ${command.description}`)
    }

    if (command.usage) {
      data.push(`**Benutzung:** ${prefix}${command.name} ${command.usage}`)
    }

    data.push(`**Cooldown:** ${command.cooldown || 2} Sekunden`)

    message.channel.send(data, { split: true })
  },
}
