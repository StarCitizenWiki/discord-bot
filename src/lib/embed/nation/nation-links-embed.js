const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../../config.json');
const { translate } = require('../../translate');

/**
 * @param {Object} data
 * @param {ChatInputCommandInteraction} interaction
 * @return {Discord.EmbedBuilder}
 */
const createEmbed = (data, interaction) => {
  const reply = new Discord.EmbedBuilder({
    title: translate(interaction, 'nations'),
    type: 'link',
    url: `${wiki_url}/Völker`,
    footer,
  });

  if (data.current > data.total) {
    reply.setDescription(translate(interaction, 'no_data'));

    return reply;
  }

  const nationLinks = data.map((nation) => `[${nation.name}](https:${nation.url})`).join('\n');

  reply.setDescription(nationLinks);

  return reply;
};

module.exports = createEmbed;
