const { SlashCommandBuilder } = require('@discordjs/builders');

const requestData = require('../lib/request/request-comm-link-data');
const createDTO = require('../lib/dto/comm-link-api-dto');
const createEmbed = require('../lib/embed/comm-links-embed');
const manageChannelNotification = require('../lib/manage-channel-notification');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comm-link')
    .setDescription('Erzeugt eine Informationskarte zu den aktuellsten Comm-Links.')
    .addBooleanOption((option) => option.setName('add').setDescription('Hinzufügen des aktuellen Kanals zu Benachrichtigungen.'))
    .addBooleanOption((option) => option.setName('remove').setDescription('Entfernen des aktuellen Kanals von Benachrichtigungen.')),

  /**
   *
   * @param {CommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.options.getBoolean('add') === true || interaction.options.getBoolean('remove') === true) {
      try {
        return manageChannelNotification(interaction, 'cl_notification_channel', 'Comm-Link');
      } catch (e) {
        console.error(e);

        return interaction.editReply({ content: 'Interner Fehler: Konnte Befehl nicht ausführen.' });
      }
    }

    const data = await requestData();
    let dto = createDTO(data);
    dto = dto.slice(0, 10);

    return interaction.editReply({ embeds: [createEmbed(dto)] });
  },
};
