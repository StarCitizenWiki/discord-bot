const Discord = require('discord.js');
const { getSystemName, getStatusName, getStatusIcon } = require('./status-helpers');

const createEmbed = (data) => {
  const reply = new Discord.EmbedBuilder({
    title: 'RSI System Status',
    type: 'link',
    url: 'https://status.robertsspaceindustries.com/',
    footer: {
      text: 'Letzte Änderung',
    },
    timestamp: data.updatedAt,
  });

  reply.addFields([
    { name: getSystemName('platform'), value: `${getStatusIcon(data.platform)} | ${getStatusName(data.platform)}` },
    { name: getSystemName('pu'), value: `${getStatusIcon(data.pu)} | ${getStatusName(data.pu)}` },
    { name: getSystemName('ea'), value: `${getStatusIcon(data.ea)} | ${getStatusName(data.ea)}` },
  ]);

  return reply;
};

module.exports = createEmbed;
