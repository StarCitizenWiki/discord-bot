const { Events } = require('discord.js');
const log = require('../lib/console-logger');

module.exports = {
  name: Events.GuildCreate,
  execute(guild) {
    if (guild.available) {
      return log(`Bot added to server "${guild.name}"`);
    }

    log('Bot added to server');
  },
};
