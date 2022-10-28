const Discord = require('discord.js');
const {
  getSystemName, getStatusName, getStatusIcon, getStatusColor, formatDescription,
} = require('./status-helpers');

const createEmbed = (data) => {
  const reply = new Discord.MessageEmbed({
    title: data.title,
    description: formatDescription(data.content),
    type: 'link',
    url: `https://status.robertsspaceindustries.com/incidents/${data.incident_id}`,
    footer: {
      text: 'Letzte Änderung',
    },
    timestamp: data.updatedAt,
  });

  reply.addFields(
      {
        name: 'Betroffene Systeme',
        value: JSON.parse(data.affected_systems).map((system) => getSystemName(system)).join(', '),
        inline: true
      },
      {name: 'Behoben', value: data.resolved === true ? 'Ja' : 'Nein', inline: true},
      {name: 'Schweregrad', value: `${getStatusIcon(data.severity)} | ${getStatusName(data.severity)}`, inline: true},
      {name: 'Seit', value: data.incident_date.toLocaleString('de-DE'), inline: true},
      {name: 'Aktualisierung', value: data.updated_date.toLocaleString('de-DE'), inline: true},
  );

  if (data.resolved === true) {
    reply.setColor(getStatusColor('operational'));
  } else {
    reply.setColor(getStatusColor(data.severity));
  }

  return reply;
};

module.exports = createEmbed;
