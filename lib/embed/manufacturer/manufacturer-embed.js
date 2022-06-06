const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../config.json');

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    timestamp: data.timestamp,
    title: `${data.name} - ${data.code}`,
    description: data.description,
    type: 'link',
    url: `${wiki_url}/${encodeURIComponent(data.name.replace(/\s/g, '_'))}`,
    footer,
  });

  let shipsString = '-';
  if (data.ships.length > 0) {
    shipsString = data.ships.map((vehicle) => vehicle.name).join(', ');
  }

  let vehicleString = '-';
  if (data.vehicles.length > 0) {
    vehicleString = data.vehicles.map((vehicle) => vehicle.name).join(', ');
  }

  reply
    .addField('Bekannt für', data.known_for)

    .addField('Raumschiffe', shipsString)
    .addField('Fahrzeuge', vehicleString);

  if (data.image !== null) {
    reply.setImage(data.image);
  }

  return reply;
};

module.exports = createEmbed;
