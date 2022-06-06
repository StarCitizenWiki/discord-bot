const { SlashCommandBuilder } = require('@discordjs/builders');

const { database } = require('../lib/db');

const createStatusEmbed = require('../lib/embed/status/status-services-embed');
const createIncidentEmbed = require('../lib/embed/status/status-incident-embed');
const manageChannelNotification = require('../lib/manage-channel-notification');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Erzeugt eine Informationskarte zu dem aktuellen RSI Systemstatus.')
    .addBooleanOption((option) => option.setName('latest').setDescription('Anzeige des letzten Vorfalls.'))
    .addBooleanOption((option) => option.setName('add').setDescription('Hinzufügen des aktuellen Kanals zu Benachrichtigungen.'))
    .addBooleanOption((option) => option.setName('remove').setDescription('Entfernt den aktuellen Kanal von Benachrichtigungen.')),
  /**
   * @param {CommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const latest = interaction.options.getBoolean('latest');
    const add = interaction.options.getBoolean('add');
    const remove = interaction.options.getBoolean('remove');


    if (add === null && remove === null && latest === null) {
      const data = await database.models.rsi_system_status.findOne({
        order: [
          ['createdAt', 'DESC'],
        ],
      });

      return interaction.editReply({ embeds: [createStatusEmbed(data)] });
    }

    if ((add || remove) === true) {
      try {
        await manageChannelNotification(interaction, 'incident_notification_channel', 'Systemstatus');
      } catch (e) {
        console.error(e);
      }
    } else if (latest === true) {
      const data = await database.models.rsi_system_incidents.findOne({
        order: [
          ['createdAt', 'DESC'],
        ],
      });

      return interaction.editReply({ embeds: [createIncidentEmbed(data)] });
    }

    return interaction.editReply({content: 'Option muss auf "true" gesetzt werden.'})
  },
};
