const Discord = require('discord.js')
const { footer, wiki_url } = require('../../../config.json')

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    title: `Sternensysteme`,
    type: 'link',
    url: `${wiki_url}/Sternensysteme`,
    footer
  })

  if (data.current > data.total) {
    reply.setDescription('Diese Seite enthält keine Daten.')

    return reply
  }

  const starsystemLinks = data.links.map(system => {
    return `[${system.name}](${wiki_url}/${encodeURIComponent(system.name.replace(' ', '_'))})`
  }).join(`\n`)

  reply.setDescription(`${starsystemLinks}\n\nSeite ${data.current} von ${data.total}`)

  return reply
}

module.exports = createEmbed
