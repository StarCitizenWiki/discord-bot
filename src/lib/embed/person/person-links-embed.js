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
    title: translate(interaction, 'persons'),
    type: 'link',
    url: `${wiki_url}/Persönlichkeiten`,
    footer,
  });

  const personLinks = data.map((person) => `[${person.name}](https:${person.url})`).join('\n');

  reply.setDescription(personLinks.length === 0 ? translate(interaction, 'no_data') : personLinks);

  return reply;
};

module.exports = createEmbed;
