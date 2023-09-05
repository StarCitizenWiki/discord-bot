const Discord = require('discord.js');
const { footer } = require('../../../config.json');
const { translate } = require('../../translate');

/**
 * @param {Object} data
 * @param {ChatInputCommandInteraction} interaction
 * @return {Discord.EmbedBuilder}
 */
const createEmbed = (data, interaction) => {
  const text = data.translation.split('. ')[0];

  const reply = new Discord.EmbedBuilder({
    title: data.title,
    description: `${text}.`,
    type: 'link',
    url: data.url,
    footer,
  });

  const related = data.relatedArticles.reduce((carry, item) => `${carry}\n[${item.title}](${item.url})`, '');

  reply.addFields([
    {
      name: translate(interaction, 'related_articles'),
      value: (related.length === 0 ? translate(interaction, 'none') : related),
    },
  ]);

  if (data.image !== null) {
    reply.setImage(data.image);
  }

  return reply;
};

module.exports = createEmbed;
