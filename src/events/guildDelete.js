const { Events } = require('discord.js');
const log = require('../lib/console-logger');
const { database } = require('../lib/db');

module.exports = {
  name: Events.GuildDelete,
  execute(guild) {
    if (guild.available) {
      log(`Bot removed from server "${guild.name}"`);

      ['cl_notification_channel', 'incident_notification_channel'].forEach((model) => {
        database.models[model].destroy({
          where: { guild_id: guild.id },
        });
      });

      return;
    }

    log('Bot removed from server');
  },
};
