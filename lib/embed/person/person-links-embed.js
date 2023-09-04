const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../config.json');

const createEmbed = (data) => {
  const reply = new Discord.EmbedBuilder({
    title: 'Persönlichkeiten',
    type: 'link',
    url: `${wiki_url}/Persönlichkeiten`,
    footer,
  });

  const personLinks = data.map((person) => `[${person.name}](https:${person.url})`).join('\n');

  reply.setDescription(personLinks.length === 0 ? 'Diese Seite enthält keine Daten.' : personLinks);

  return reply;
};

module.exports = createEmbed;
