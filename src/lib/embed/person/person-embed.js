const Discord = require('discord.js');
const { footer } = require('../../../../config.json');
const { translate } = require('../../translate');

const formatDate = (date) => {
  if (date === 0) {
    return '-';
  }

  const dateObj = new Date(parseInt(date) * 1000);

  return dateObj.getFullYear().toString();
};

/**
 * @param {Object} data
 * @param {string} image
 * @param {ChatInputCommandInteraction} interaction
 * @return {Discord.EmbedBuilder}
 */
const createEmbed = (data, image, interaction) => {
  const reply = new Discord.EmbedBuilder({
    timestamp: data.timestamp,
    title: data.name,
    // description: data.description,
    type: 'link',
    url: `https:${data.url}`,
    footer,
  });

  reply.addFields([
    { name: translate(interaction, 'birth'), value: formatDate(data.birth), inline: true },
    { name: translate(interaction, 'death'), value: formatDate(data.death), inline: true },
    { name: translate(interaction, 'gender'), value: data.gender, inline: true },
    { name: translate(interaction, 'nation'), value: data.nation, inline: true },
  ]);

  const links = [
    `[Wiki](https:${data.url})`,
  ];

  data.sources.forEach((source) => {
    if (source.includes('galactapedia')) {
      links.push(`[Galactapedia](${source})`);
    }
  });

  reply.addFields([
    { name: translate(interaction, 'links'), value: links.join(' · ') },
    { name: translate(interaction, 'family'), value: data.relatives.length === 0 ? '-' : data.relatives.join(', ') },
  ]);

  if (image !== null) {
    reply.setImage(image);
  }

  return reply;
};

module.exports = createEmbed;
