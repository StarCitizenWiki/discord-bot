const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../../config.json');

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

const formatPrice = (price) => {
  if (price === 0) {
    return '-';
  }

  return `${price.toLocaleString('de-DE')}$`;
};

const formatSpeed = (speed) => {
  if (speed === 0) {
    return '-';
  }

  return `${speed.toLocaleString('de-DE')} m/s`;
};

const formatWeight = (weight) => {
  if (weight === 0) {
    return '-';
  }

  return `${weight.toLocaleString('de-DE')} Kg`;
};

const formatCargo = (cargo) => {
  if (cargo === 0) {
    return '-';
  }

  return `${cargo.toLocaleString('de-DE')} SCU`;
};

const createEmbed = (data) => {
  const reply = new Discord.EmbedBuilder({
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
    { name: 'Länge', value: `${data.length} m`, inline: true },
    { name: 'Breite', value: `${data.beam} m`, inline: true },
    { name: 'Höhe', value: `${data.height} m`, inline: true },
    { name: 'Besatzung', value: formatCrew(data), inline: true },
    { name: 'Kampf Geschw.', value: formatSpeed(data.scm), inline: true },
    { name: 'Max. Geschw.', value: formatSpeed(data.afterburner), inline: true },
    { name: 'Gewicht', value: formatWeight(data.mass), inline: true },
    { name: 'Frachtkapazität', value: formatCargo(data.cargo), inline: true },
    { name: 'Inventar', value: formatCargo(data.vehicle_inventory), inline: true },
    { name: 'Pers. Inventar', value: formatCargo(data.personal_inventory), inline: true },
    { name: 'Aktueller Preis', value: formatPrice(data.price), inline: true },
  ]);

  let { foci } = data;
  if (data.foci.length > 0) {
    foci = foci.join(' und ');
  } else {
    foci = '-';
  }

  reply.addFields([
    {
      name: 'Hersteller',
      value: `[${data.manufacturer}](${wiki_url}/${encodeURIComponent(data.manufacturer.replace(/\s/g, '_'))})`,
      inline: true,
    },
    { name: 'Fokus', value: foci, inline: true },
    { name: 'Größe', value: (`${data.size}`).length === 0 ? '-' : data.size, inline: true },
    { name: 'Status', value: data.status.length === 0 ? '-' : data.status, inline: true },
  ]);

  const links = [
    `[Wiki](${wiki_url}/${encodeURIComponent(data.name.replace(/\s/g, '_'))})`,
    `[Fleet Yard](https://fleetyards.net/ships/${encodeURIComponent(data.name.replace(/\s/g, '-').toLowerCase())})`,
  ];

  let pledgeAdded = false;
  let youtubeAdded = false;

  data.sources.forEach((source) => {
    if (source.includes('Broschüre')) {
      links.push(`[Broschüre](${source})`);
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

  reply.addFields([{ name: 'Links', value: links.join(' · ') }]);

  if (data.image !== null) {
    reply.setImage(data.image);
  }

  return reply;
};

module.exports = createEmbed;
