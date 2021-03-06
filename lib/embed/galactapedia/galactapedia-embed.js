const Discord = require('discord.js')
const { footer } = require('../../../config.json')

const createEmbed = (data) => {
  const text = data.translation.split('. ')[0]

  const reply = new Discord.MessageEmbed({
    title: data.title,
    description: `${text}.`,
    type: 'link',
    url: data.url,
    footer
  })

  reply
    .addField('Kategorie', data.categories.join(', '), true)

    .addField('Verwandte Artikel', data.relatedArticles.reduce((carry, item) => {
      return `${carry}\n[${item.title}](${item.url})`
    }, ''))

  if (data.image !== null) {
    reply.setImage(data.image)
  }

  return reply
}

module.exports = createEmbed
