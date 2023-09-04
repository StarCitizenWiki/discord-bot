const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../config.json');

const createEmbed = (data) => {
  const title = data.length === 1 ? 'Der neueste Comm-Link' : 'Die neuesten Comm-Links';
  const url = data.length === 1 ? `${wiki_url}/Comm-Link:${data[0].id}` : `${wiki_url}/Comm-Link:Übersicht`;

  const reply = new Discord.EmbedBuilder({
    title,
    type: 'link',
    url,
    footer,
  });

  data.forEach((commLink) => {
    reply.addFields([{
      name: `${commLink.title}`,
      value: `${(new Date(commLink.timestamp)).toLocaleDateString('de-DE')} - [Wiki](${commLink.wikiUrl}) - [RSI](${commLink.rsiUrl})\n${commLink.channel} (${commLink.category})`,
    }]);
  });

  return reply;
};

module.exports = createEmbed;
