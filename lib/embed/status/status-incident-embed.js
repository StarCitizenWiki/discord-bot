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

  reply
    .addField(
      'Betroffene Systeme',
      JSON.parse(data.affected_systems).map((system) => getSystemName(system)).join(', '),
      true,
    )
    .addField('Behoben', data.resolved === true ? 'Ja' : 'Nein', true)
    .addField('Schweregrad', `${getStatusIcon(data.severity)} | ${getStatusName(data.severity)}`, true)
    .addField('Seit', data.incident_date.toLocaleString('de-DE'), true)
    .addField('Aktualisierung', data.updated_date.toLocaleString('de-DE'), true);

  if (data.resolved === true) {
    reply.setColor(getStatusColor('operational'));
  } else {
    reply.setColor(getStatusColor(data.severity));
  }

  return reply;
};

module.exports = createEmbed;
