const Discord = require('discord.js')
const { footer, wiki_url } = require('../../config.json')

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    title: `Die neuesten Comm-Links`,
    type: 'link',
    url: `${wiki_url}/Comm-Link:Übersicht`,
    footer
  })

  data.forEach(commLink => {
    reply.addField(
      `${commLink.title}`,
      `${(new Date(commLink.timestamp)).toLocaleDateString('de-DE')} - [Wiki](${commLink.wikiUrl}) - [RSI](${commLink.rsiUrl})\n${commLink.channel} (${commLink.category})`
    )
  })

  return reply
}

module.exports = createEmbed
