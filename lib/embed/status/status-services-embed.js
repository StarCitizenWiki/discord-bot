const Discord = require('discord.js')
const { getSystemName, getStatusName, getStatusIcon } = require('./status-helpers')

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    title: `RSI System Status`,
    type: 'link',
    url: `https://status.robertsspaceindustries.com/`,
    footer: {
      text: 'Letzte Änderung',
    },
    timestamp: data.updatedAt
  })

  reply
    .addField(getSystemName('platform'), `${getStatusIcon(data.platform)} | ${getStatusName(data.platform)}`)
    .addField(getSystemName('pu'), `${getStatusIcon(data.pu)} | ${getStatusName(data.pu)}`)
    .addField(getSystemName('ea'), `${getStatusIcon(data.ea)} | ${getStatusName(data.ea)}`)

  return reply
}

module.exports = createEmbed
