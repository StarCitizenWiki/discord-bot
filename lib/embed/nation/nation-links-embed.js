const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../config.json');

const createEmbed = (data) => {
  const reply = new Discord.EmbedBuilder({
    title: 'Völker',
    type: 'link',
    url: `${wiki_url}/Völker`,
    footer,
  });

  if (data.current > data.total) {
    reply.setDescription('Diese Seite enthält keine Daten.');

    return reply;
  }

  const nationLinks = data.map((nation) => `[${nation.name}](https:${nation.url})`).join('\n');

  reply.setDescription(nationLinks);

  return reply;
};

module.exports = createEmbed;
