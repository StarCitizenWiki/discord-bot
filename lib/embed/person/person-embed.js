const Discord = require('discord.js')
const { footer } = require('../../../config.json')

const formatDate = (date) => {
  if (date === 0) {
    return '-'
  }

  const dateObj = new Date(parseInt(date) * 1000)

  return dateObj.getFullYear()
  //return dateObj.toLocaleDateString('de-DE')
}

const createEmbed = (data, image) => {
  const reply = new Discord.MessageEmbed({
    timestamp: data.timestamp,
    title: data.name,
    //description: data.description,
    type: 'link',
    url: `https:${data.url}`,
    footer
  })

  reply
    .addField('Geburtsdatum', formatDate(data.birth), true)
    .addField('Todesdatum', formatDate(data.death), true)
    .addField('Geschlecht', data.gender, true)

    .addField('Volk', data.nation, true)

  const links = [
    `[Wiki](https:${data.url})`
  ]

  data.sources.forEach(source => {
    if (source.includes('galactapedia')) {
      links.push(`[Galactapedia](${source})`)
    }
  })

  reply
    .addField('Links', links.join(' · '))
    .addField('Familie', data.relatives.length === 0 ? '-' : data.relatives.join(', '))

  if (image !== null) {
    reply.setImage(image)
  }

  return reply
}

module.exports = createEmbed
