const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../config.json');
const { translate } = require('../../translate');

/**
 * @param {Object} data
 * @param {ChatInputCommandInteraction} interaction
 * @return {Discord.EmbedBuilder}
 */
const createEmbed = (data, interaction) => {
  const reply = new Discord.EmbedBuilder({
    timestamp: data.timestamp,
    title: data.name,
    description: data.description,
    type: 'link',
    url: `${wiki_url}/${encodeURIComponent(data.name)}`,
    color: data.color,
    footer,
  });

  let jumppoints = data.jumppoints.map((jumppoint) => `[${jumppoint}](${wiki_url}/${encodeURIComponent(jumppoint)})`).join(', ');

  if (jumppoints.length === 0) {
    jumppoints = 'Keine';
  }

  reply.addFields([
    { name: translate(interaction, 'size'), value: `${data.size} AE`, inline: true },
    { name: translate(interaction, 'affiliation'), value: `[${data.affiliation}](${wiki_url}/${data.affiliation})`, inline: true },
    { name: translate(interaction, 'status'), value: data.status, inline: true },
    { name: translate(interaction, 'population'), value: data.population.toString(), inline: true },
    { name: translate(interaction, 'economy'), value: data.economy.toString(), inline: true },
    { name: translate(interaction, 'danger'), value: data.danger.toString(), inline: true },
    { name: translate(interaction, 'stars'), value: data.stars_count.toString(), inline: true },
    { name: translate(interaction, 'planets'), value: data.planets_count.toString(), inline: true },
    { name: translate(interaction, 'stations'), value: data.stations_count.toString(), inline: true },
    { name: translate(interaction, 'jumppoints'), value: jumppoints },
  ]);

  if (data.image !== null) {
    reply.setImage(data.image);
  }

  return reply;
};

module.exports = createEmbed;
