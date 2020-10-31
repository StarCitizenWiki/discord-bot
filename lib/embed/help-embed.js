const Discord = require('discord.js')
const { prefix } = require('../../config.json')

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    title: `Hilfe zu Befehl: \`${data.name}\``,
    description: data.description,
  })

  reply.addField('Aliasse', (typeof data.aliases === 'undefined' || data.aliases.length === 0) ? '\u200b' : data.aliases.join(', '), true)
    .addField('Cooldown', `${(data.cooldown ?? 3)} Sekunden`, true)
    .addField('Benutzung', `\`${prefix}${data.name} ${data.usage ?? ''}\``)

  if (typeof data.examples !== 'undefined' && Array.isArray(data.examples)) {
    reply.addField('Beispiele', data.examples.map(example => example.replace('$PREFIX', prefix)).join(`\n`))
  }

  return reply
}

module.exports = createEmbed
