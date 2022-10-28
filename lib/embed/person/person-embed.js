const Discord = require('discord.js');
const { footer } = require('../../../config.json');

const formatDate = (date) => {
  if (date === 0) {
    return '-';
  }

  const dateObj = new Date(parseInt(date) * 1000);

  return dateObj.getFullYear().toString();
};

const createEmbed = (data, image) => {
  const reply = new Discord.MessageEmbed({
    timestamp: data.timestamp,
    title: data.name,
    // description: data.description,
    type: 'link',
    url: `https:${data.url}`,
    footer,
  });

  reply.addFields(
      {name: 'Geburtsdatum', value: formatDate(data.birth), inline: true},
      {name: 'Todesdatum', value: formatDate(data.death), inline: true},
      {name: 'Geschlecht', value: data.gender, inline: true},
      {name: 'Volk', value: data.nation, inline: true}
  )

  const links = [
    `[Wiki](https:${data.url})`,
  ];

  data.sources.forEach((source) => {
    if (source.includes('galactapedia')) {
      links.push(`[Galactapedia](${source})`);
    }
  });

  reply.addFields(
      {name: 'Links', value: links.join(' · ')},
      {name: 'Familie', value: data.relatives.length === 0 ? '-' : data.relatives.join(', ')}
  );

  if (image !== null) {
    reply.setImage(image);
  }

  return reply;
};

module.exports = createEmbed;
