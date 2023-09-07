const { EmbedBuilder } = require('discord.js');
const { footer, wiki_url } = require('../../../config.json');
const { getLocale } = require('../translate');

/**
 * @param {Object} data
 * @param {ChatInputCommandInteraction} interaction
 * @return {EmbedBuilder}
 */
const createEmbed = (data, interaction) => {
  const title = data.length === 1 ? 'Der neueste Comm-Link' : 'Die neuesten Comm-Links';
  const url = data.length === 1 ? `${wiki_url}/Comm-Link:${data[0].id}` : `${wiki_url}/Comm-Link:Übersicht`;

  const reply = new EmbedBuilder({
    title,
    type: 'link',
    url,
    footer,
  });

  data.forEach((commLink) => {
    reply.addFields([{
      name: `${commLink.title}`,
      value: `${(new Date(commLink.timestamp)).toLocaleDateString(getLocale(interaction))} - [Wiki](${commLink.wikiUrl}) - [RSI](${commLink.rsiUrl})\n${commLink.channel} (${commLink.category})`,
    }]);
  });

  return reply;
};

module.exports = createEmbed;
