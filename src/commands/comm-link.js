const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

const requestData = require('../lib/request/request-comm-link-data');
const createDTO = require('../lib/dto/comm-link-api-dto');
const createEmbed = require('../lib/embed/comm-links-embed');
const manageChannelNotification = require('../lib/manage-channel-notification');
const { translate } = require('../lib/translate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comm-link')
    .setDescription('Erzeugt eine Informationskarte zu den aktuellsten Comm-Links.')
    .setDescriptionLocalizations({
      de: 'Creates an information card about the most recent comm links.',
      fr: 'Crée une carte d\'information sur les liens de comm les plus récents',
    })
    .addBooleanOption((option) => option.setName('add')
      .setNameLocalizations({
        de: 'hinzufügen',
        'en-US': 'add',
        fr: 'ajouter',
      })
      .setDescription('Hinzufügen des aktuellen Kanals zu Benachrichtigungen.')
      .setDescriptionLocalizations({
        'en-US': 'Setup the current channel to receive notifications.',
        fr: 'Ajouter le canal actuel aux notifications.',
      }))
    .addBooleanOption((option) => option.setName('remove')
      .setNameLocalizations({
        de: 'entfernen',
        'en-US': 'remove',
        fr: 'supprimer',
      })
      .setDescription('Entfernt den aktuellen Kanal von von Benachrichtigungen.')
      .setDescriptionLocalizations({
        'en-US': 'Remove the current channel from notifications.',
        fr: 'Supprimer le canal actuel des notifications.',
      })),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.options.getBoolean('add') === true || interaction.options.getBoolean('remove') === true) {
      try {
        return manageChannelNotification(interaction, 'cl_notification_channel', 'Comm-Link');
      } catch (e) {
        console.error(e);

        return interaction.editReply({ content: translate(interaction, 'command_error') });
      }
    }

    const data = await requestData(interaction);
    let dto = createDTO(data);
    dto = dto.slice(0, 10);

    return interaction.editReply({ embeds: [createEmbed(dto, interaction)] });
  },
};
