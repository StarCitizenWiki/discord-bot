const Discord = require('discord.js')
const { footer, wiki_url } = require('../../../config.json')

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    title: `Persönlichkeiten`,
    type: 'link',
    url: `${wiki_url}/Persönlichkeiten`,
    footer
  })

  if (data.current > data.total) {
    reply.setDescription('Diese Seite enthält keine Daten.')

    return reply
  }

  const personLinks = data.map(person => {
    return `[${person.name}](https:${person.url})`
  }).join(`\n`)

  reply.setDescription(personLinks)

  return reply
}

module.exports = createEmbed
