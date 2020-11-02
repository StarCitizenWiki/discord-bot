const Discord = require('discord.js')
const { footer, wiki_url } = require('../../../config.json')

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    timestamp: data.timestamp,
    title: data.name,
    description: data.description,
    type: 'link',
    url: `${wiki_url}/${encodeURIComponent(data.name)}`,
    color: data.color,
    footer
  })

  let jumppoints = data.jumppoints.map(jumppoint => {
    return `[${jumppoint}](${wiki_url}/${encodeURIComponent(jumppoint)})`
  }).join(', ')

  if (jumppoints.length === 0) {
    jumppoints = 'Keine'
  }

  reply
    .addField('Größe', data.size + ' AE', true)
    .addField('Kontrolle', `[${data.affiliation}](${wiki_url}/${data.affiliation})`, true)
    .addField('Status', data.status, true)

    .addField('Bevölkerung', data.population, true)
    .addField('Wirtschaft', data.economy, true)
    .addField('Gefahrenlage', data.danger, true)

    .addField('Sterne', data.stars_count, true)
    .addField('Planeten', data.planets_count, true)
    .addField('Raumstationen', data.stations_count, true)

    .addField('Sprungpunkte', jumppoints)

  if (data.image !== null) {
    reply.setImage(data.image)
  }

  return reply
}

module.exports = createEmbed
