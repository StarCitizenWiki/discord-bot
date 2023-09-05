const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../../config.json');
const { translate } = require('../../translate');

const createEmbed = (data, interaction) => {
  const reply = new Discord.EmbedBuilder({
    title: translate(interaction, 'starsystems'),
    type: 'link',
    url: `${wiki_url}/Sternensysteme`,
    footer,
  });

  if (data.current > data.total) {
    reply.setDescription(translate(interaction, 'no_data'));

    return reply;
  }

  const starsystemLinks = data.links.map((system) => `[${system.name}](${wiki_url}/${encodeURIComponent(system.name.replace(/\s/g, '_'))})`).join('\n');

  reply.setDescription(`${starsystemLinks}\n\n${translate(interaction, 'page')} ${data.current} ${translate(interaction, 'of')} ${data.total}`);

  return reply;
};

module.exports = createEmbed;
