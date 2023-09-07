const { EmbedBuilder } = require('discord.js');
const {
  getStatusIcon, getStatusColor, formatDescription,
} = require('./status-helpers');
const { translate, getLocale } = require('../../translate');

/**
 * @param {Object} data
 * @param {ChatInputCommandInteraction} interaction
 * @return {EmbedBuilder}
 */
const createEmbed = (data, interaction) => {
  const reply = new EmbedBuilder({
    title: data.title,
    description: formatDescription(data.content),
    type: 'link',
    url: `https://status.robertsspaceindustries.com/incidents/${data.incident_id}`,
    footer: {
      text: translate(interaction, 'last_changed'),
    },
    timestamp: data.updatedAt,
  });

  reply.addFields([
    {
      name: translate(interaction, 'affected_systems'),
      value: JSON.parse(data.affected_systems).map((system) => translate(interaction, system)).join(', '),
      inline: true,
    },
    { name: translate(interaction, 'resolved'), value: data.resolved === true ? translate(interaction, 'yes') : translate(interaction, 'no'), inline: true },
    { name: translate(interaction, 'severity'), value: `${getStatusIcon(data.severity)} | ${translate(interaction, data.severity)}`, inline: true },
    { name: translate(interaction, 'incident_date'), value: data.incident_date.toLocaleString(getLocale(interaction)), inline: true },
    { name: translate(interaction, 'updated_date'), value: data.updated_date.toLocaleString(getLocale(interaction)), inline: true },
  ]);

  if (data.resolved === true) {
    reply.setColor(getStatusColor('operational'));
  } else {
    reply.setColor(getStatusColor(data.severity));
  }

  return reply;
};

module.exports = createEmbed;
