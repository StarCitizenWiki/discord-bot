const { EmbedBuilder } = require('discord.js');
const { footer, wiki_url } = require('../../../../config.json');
const { translate } = require('../../translate');

/**
 * @param {Object} data
 * @param {ChatInputCommandInteraction} interaction
 * @return {EmbedBuilder}
 */
const createEmbed = (data, interaction) => {
  const reply = new EmbedBuilder({
    title: translate(interaction, 'manufacturer'),
    type: 'link',
    url: `${wiki_url}/Kategorie:Unternehmen`,
    footer,
  });

  reply.setDescription(data.map((manufacturer) => `[${manufacturer.name} (${manufacturer.code})](${wiki_url}/${encodeURIComponent(manufacturer.name.replace(/\s/g, '_'))})`).join('\n'));
  return reply;
};

module.exports = createEmbed;
