const Discord = require('discord.js');
const {footer, wiki_url} = require('../../../config.json');

const createEmbed = (data) => {
    const reply = new Discord.MessageEmbed({
        timestamp: data.timestamp,
        title: data.name,
        description: data.description,
        type: 'link',
        url: `${wiki_url}/${encodeURIComponent(data.name)}`,
        color: data.color,
        footer,
    });

    let jumppoints = data.jumppoints.map((jumppoint) => `[${jumppoint}](${wiki_url}/${encodeURIComponent(jumppoint)})`).join(', ');

    if (jumppoints.length === 0) {
        jumppoints = 'Keine';
    }

    reply.addFields(
        {name: 'Größe', value: `${data.size} AE`, inline: true},
        {name: 'Kontrolle', value: `[${data.affiliation}](${wiki_url}/${data.affiliation})`, inline: true},
        {name: 'Status', value: data.status, inline: true},
        {name: 'Bevölkerung', value: data.population.toString(), inline: true},
        {name: 'Wirtschaft', value: data.economy.toString(), inline: true},
        {name: 'Gefahrenlage', value: data.danger.toString(), inline: true},
        {name: 'Sterne', value: data.stars_count.toString(), inline: true},
        {name: 'Planeten', value: data.planets_count.toString(), inline: true},
        {name: 'Raumstationen', value: data.stations_count.toString(), inline: true},
        {name: 'Sprungpunkte', value: jumppoints},
    )

    if (data.image !== null) {
        reply.setImage(data.image);
    }

    return reply;
};

module.exports = createEmbed;
