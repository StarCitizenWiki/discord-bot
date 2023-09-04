const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../../config.json');

const createEmbed = (data, title) => {
  const reply = new Discord.EmbedBuilder({
    title: `${title}`,
    type: 'link',
    url: `${wiki_url}/${title}`,
    footer,
  });

  if (data.current > data.total) {
    reply.setDescription('Diese Seite enthält keine Daten.');

    return reply;
  }

  const shipLinks = data.links.map((ship) => `[${ship.name}](${wiki_url}/${encodeURIComponent(ship.name.replace(/\s/g, '_'))})`).join('\n');

  reply.setDescription(`${shipLinks}\n\nSeite ${data.current} von ${data.total}`);

  return reply;
};

module.exports = createEmbed;
