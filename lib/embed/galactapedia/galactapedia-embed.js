const Discord = require('discord.js');
const {footer} = require('../../../config.json');

const createEmbed = (data) => {
    const text = data.translation.split('. ')[0];

    const reply = new Discord.MessageEmbed({
        title: data.title,
        description: `${text}.`,
        type: 'link',
        url: data.url,
        footer,
    });

    const related = data.relatedArticles.reduce((carry, item) => `${carry}\n[${item.title}](${item.url})`, '');

    reply.addFields(
        //{name: 'Kategorie', value: data.categories.join(', '), inline: true},
        {name: 'Verwandte Artikel', value: (related.length === 0 ? 'Keine' : related)}
    );

    if (data.image !== null) {
        reply.setImage(data.image);
    }

    return reply;
};

module.exports = createEmbed;
