const Discord = require('discord.js')
const { footer, wiki_url } = require('../../config.json')

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    title: `Hersteller`,
    type: 'link',
    url: `${wiki_url}/Kategorie:Unternehmen`,
    footer
  })

  reply.setDescription(data.map(manufacturer => {
    return `[${manufacturer.name} (${manufacturer.code})](${wiki_url}/${encodeURIComponent(manufacturer.name.replace(' ', '_'))})`
  }).join(`\n`))

  return reply
}

module.exports = createEmbed
