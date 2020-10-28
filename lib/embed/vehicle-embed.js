const Discord = require('discord.js')
const { footer } = require('../../config.json')

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    timestamp: data.timestamp,
    title: data.name,
    description: data.description,
    type: 'link',
    url: 'https://star-citizen.wiki/' + encodeURIComponent(data.name),
    footer
  })

  reply
    .addField('Länge', data.length + ' m', true)
    .addField('Breite', data.beam + ' m', true)
    .addField('Höhe', data.height + ' m', true)

    .addField('Besatzung', data.crew_max, true)
    .addField('Geschwindigkeit', data.scm.toLocaleString('de-DE') + ' m/s', true)
    .addField('Afterburner', data.afterburner.toLocaleString('de-DE') + ' m/s', true)

    .addField('Gewicht', data.mass.toLocaleString('de-DE') + ' Kg', true)
    .addField('Frachtkapazität', data.cargo + ' SCU', true)
    .addField('Fokus', data.foci.join(' und '), true)

    .addField('Hersteller', `[${data.manufacturer}](https://star-citizen.wiki/${encodeURIComponent(data.manufacturer)})`, true)
    .addField('Größe', data.size, true)
    .addField('Status', data.status, true)

  if (data.image !== null) {
    reply.setImage(data.image)
  }

  return reply
}

module.exports = createEmbed
