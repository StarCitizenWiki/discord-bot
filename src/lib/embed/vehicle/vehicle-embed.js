const { EmbedBuilder } = require('discord.js');
const { footer, wiki_url } = require('../../../../config.json');
const { translate, getLocale } = require('../../translate');

const formatCrew = (data) => {
  if (data.crew_min === 0 && data.crew_max === 0) {
    return '-';
  }

  if (data.crew_min === data.crew_max) {
    return data.crew_max.toString();
  }

  let crewString = '';

  if (data.crew_min !== 0) {
    crewString = `${data.crew_min} - `;
  }

  if (data.crew_max !== 0) {
    crewString = `${crewString}${data.crew_max}`;
  }

  return crewString.toString();
};

const formatPrice = (price, interaction) => {
  if (price === 0) {
    return '-';
  }

  return `${price.toLocaleString(getLocale(interaction))}$`;
};

const formatSpeed = (speed, interaction) => {
  if (speed === 0) {
    return '-';
  }

  return `${speed.toLocaleString(getLocale(interaction))} m/s`;
};

const formatWeight = (weight, interaction) => {
  if (weight === 0) {
    return '-';
  }

  return `${weight.toLocaleString(getLocale(interaction))} Kg`;
};

const formatCargo = (cargo, interaction) => {
  if (cargo === 0) {
    return '-';
  }

  return `${cargo.toLocaleString(getLocale(interaction))} SCU`;
};

/**
 * @param {Object} data
 * @param {ChatInputCommandInteraction} interaction
 * @return {EmbedBuilder}
 */
const createEmbed = (data, interaction) => {
  const reply = new EmbedBuilder({
    timestamp: data.timestamp,
    title: data.name,
    description: data.description.length === 0 ? '-' : data.description,
    type: 'link',
    url: `${wiki_url}/${encodeURIComponent(data.name.replace(/\s/g, '_'))}`,
    author: {
      name: `${data.manufacturer} (${data.manufacturer_code})`,
    },
    footer,
  });

  reply.addFields([
    { name: translate(interaction, 'length'), value: `${data.length} m`, inline: true },
    { name: translate(interaction, 'width'), value: `${data.beam} m`, inline: true },
    { name: translate(interaction, 'height'), value: `${data.height} m`, inline: true },
    { name: translate(interaction, 'crew'), value: formatCrew(data), inline: true },
    { name: translate(interaction, 'scm'), value: formatSpeed(data.scm, interaction), inline: true },
    { name: translate(interaction, 'speed'), value: formatSpeed(data.afterburner, interaction), inline: true },
    { name: translate(interaction, 'weight'), value: formatWeight(data.mass, interaction), inline: true },
    { name: translate(interaction, 'scu'), value: formatCargo(data.cargo, interaction), inline: true },
    { name: translate(interaction, 'inventory'), value: formatCargo(data.vehicle_inventory, interaction), inline: true },
    { name: translate(interaction, 'stowage'), value: formatCargo(data.personal_inventory, interaction), inline: true },
    { name: translate(interaction, 'price'), value: formatPrice(data.price, interaction), inline: true },
  ]);

  let { foci } = data;
  if (data.foci.length > 0) {
    foci = foci.join(` ${translate(interaction, 'and')} `);
  } else {
    foci = '-';
  }

  reply.addFields([
    {
      name: translate(interaction, 'manufacturer'),
      value: `[${data.manufacturer}](${wiki_url}/${encodeURIComponent(data.manufacturer.replace(/\s/g, '_'))})`,
      inline: true,
    },
    { name: translate(interaction, 'focus'), value: foci, inline: true },
    { name: translate(interaction, 'size'), value: (`${data.size}`).length === 0 ? '-' : data.size, inline: true },
    { name: translate(interaction, 'status'), value: data.status.length === 0 ? '-' : data.status, inline: true },
  ]);

  const links = [
    `[Wiki](${wiki_url}/${encodeURIComponent(data.name.replace(/\s/g, '_'))})`,
    `[Fleet Yard](https://fleetyards.net/ships/${encodeURIComponent(data.name.replace(/\s/g, '-').toLowerCase())})`,
  ];

  let pledgeAdded = false;
  let youtubeAdded = false;

  data.sources.forEach((source) => {
    if (source.includes(translate(interaction, 'brochure'))) {
      links.push(`[${translate(interaction, 'brochure')}](${source})`);
    }

    if (source.includes('/pledge/ships') && !source.includes('#') && !pledgeAdded) {
      pledgeAdded = true;
      links.push(`[Pledge Store](${source})`);
    }

    if (source.includes('youtube') && !youtubeAdded) {
      youtubeAdded = true;
      links.push(`[YouTube](${source})`);
    }
  });

  reply.addFields([{ name: translate(interaction, 'links'), value: links.join(' · ') }]);

  if (data.image !== null) {
    reply.setImage(data.image);
  }

  return reply;
};

module.exports = createEmbed;
