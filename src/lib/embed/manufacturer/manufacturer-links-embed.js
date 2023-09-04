const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../../config.json');

const createEmbed = (data) => {
  const reply = new Discord.EmbedBuilder({
    title: 'Hersteller',
    type: 'link',
    url: `${wiki_url}/Kategorie:Unternehmen`,
    footer,
  });

  reply.setDescription(data.map((manufacturer) => `[${manufacturer.name} (${manufacturer.code})](${wiki_url}/${encodeURIComponent(manufacturer.name.replace(/\s/g, '_'))})`).join('\n'));
  return reply;
};

module.exports = createEmbed;
