const { Events } = require('discord.js');
const log = require('../lib/console-logger');
const { translate } = require('../lib/translate');

module.exports = {
  name: Events.InteractionCreate,
  execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    command.execute(interaction)
      .catch((error) => {
        if (error.code === 'ENOTFOUND') {
          log('Could not connect to API', error.message, 'error');

          return interaction.editReply({ content: translate(interaction, 'error_api_not_found') });
        }

        if (typeof error.response !== 'undefined' && typeof error.response.status !== 'undefined') {
          if (error.response.status === 504 || error.response.status === 500) {
            log('Could not connect to API', error, 'error');

            return interaction.editReply({ content: translate(interaction, 'error_api_no_connection') });
          }

          if (error.response.status === 404) {
            log('Call resulted in 404', {
              command: command.data.name,
              args: interaction.options.getString('name') ?? interaction.options.getString('suche'),
            }, 'debug');

            if (error.response?.statusText !== 'Not Found') {
              console.error(error);
            }

            return interaction.editReply({ content: translate(interaction, 'error_no_data') });
          }

          if (error.response.status === 429) {
            log('API calls are rate-limited', {}, 'warn');

            return interaction.editReply({ content: translate(interaction, 'error_too_many_requests') });
          }
        }

        console.error(error);
        interaction.reply({ content: translate(interaction, 'error_command_failure') })
          .catch(() => {
            log('Could not send message');
          });
      });
  },
};
