const { EmbedBuilder } = require('discord.js');
const { getStatusIcon } = require('./status-helpers');
const { translate } = require('../../translate');

/**
 * @param {Object} data
 * @param {ChatInputCommandInteraction} interaction
 * @return {EmbedBuilder}
 */
const createEmbed = (data, interaction) => {
  const reply = new EmbedBuilder({
    title: 'RSI System Status',
    type: 'link',
    url: 'https://status.robertsspaceindustries.com/',
    footer: {
      text: translate(interaction, 'last_changed'),
    },
    timestamp: data.updatedAt,
  });

  reply.addFields([
    { name: translate(interaction, 'platform'), value: `${getStatusIcon(data.platform)} | ${translate(interaction, data.platform)}` },
    { name: translate(interaction, 'pu'), value: `${getStatusIcon(data.pu)} | ${translate(interaction, data.pu)}` },
    { name: translate(interaction, 'ea'), value: `${getStatusIcon(data.ea)} | ${translate(interaction, data.ea)}` },
  ]);

  return reply;
};

module.exports = createEmbed;
