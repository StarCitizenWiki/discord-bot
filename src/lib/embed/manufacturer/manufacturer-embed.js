const Discord = require('discord.js');
const { footer, wiki_url } = require('../../../../config.json');

const createEmbed = (data) => {
  const reply = new Discord.EmbedBuilder({
    timestamp: data.timestamp,
    title: `${data.name} - ${data.code}`,
    description: data.description,
    type: 'link',
    url: `${wiki_url}/${encodeURIComponent(data.name.replace(/\s/g, '_'))}`,
    footer,
  });

  let shipsString = '-';
  if (data.ships.length > 0) {
    shipsString = data.ships.slice(0, 5).map((vehicle) => vehicle.name).join(', ');
  }

  let vehicleString = '-';
  if (data.vehicles.length > 0) {
    vehicleString = data.vehicles.slice(0, 5).map((vehicle) => vehicle.name).join(', ');
  }

  let itemString = '-';
  if (data.items.length > 0) {
    itemString = data.items.slice(0, 20).map((vehicle) => vehicle.name).join(', ');
  }

  reply.addFields([
    { name: 'Raumschiffe', value: shipsString },
    { name: 'Fahrzeuge', value: vehicleString },
    { name: 'Items', value: itemString },
  ]);

  if (data.image !== null) {
    reply.setImage(data.image);
  }

  return reply;
};

module.exports = createEmbed;
