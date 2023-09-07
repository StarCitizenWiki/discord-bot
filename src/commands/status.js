const { SlashCommandBuilder } = require('discord.js');

const { database } = require('../lib/db');

const createStatusEmbed = require('../lib/embed/status/status-services-embed');
const createIncidentEmbed = require('../lib/embed/status/status-incident-embed');
const manageChannelNotification = require('../lib/manage-channel-notification');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setNameLocalizations({
      'en-US': 'status',
      fr: 'état',
    })
    .setDescription('Erzeugt eine Informationskarte zu dem aktuellen RSI Systemstatus.')
    .setDescriptionLocalizations({
      'en-US': 'Generates an information card about the current RSI system status.',
      fr: 'Génère une carte d\'information sur l\'état actuel du système RSI.',
    })
    .addBooleanOption((option) => option.setName('latest')
      .setNameLocalizations({
        'en-US': 'latest',
        fr: 'recent',
      })
      .setDescription('Anzeige des letzten Vorfalls.')
      .setDescriptionLocalizations({
        'en-US': 'Information about the most recent incident.',
        fr: 'Affichage du dernier incident.',
      }))
    .addBooleanOption((option) => option.setName('add')
      .setNameLocalizations({
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
        'en-US': 'remove',
        fr: 'supprimer',
      })
      .setDescription('Entfernt den aktuellen Kanal von Benachrichtigungen.')
      .setDescriptionLocalizations({
        'en-US': 'Remove the current channel from notifications.',
        fr: 'Supprimer le canal actuel des notifications.',
      })),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const latest = interaction.options.getBoolean('latest');
    const add = interaction.options.getBoolean('add');
    const remove = interaction.options.getBoolean('remove');

    if (add === null && remove === null && latest === null) {
      const data = await database.models.rsi_system_status.findOne({
        order: [
          ['createdAt', 'DESC'],
        ],
      });

      return interaction.editReply({ embeds: [createStatusEmbed(data, interaction)] });
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

      return interaction.editReply({ embeds: [createIncidentEmbed(data, interaction)] });
    }

    return interaction.editReply({ content: 'Option muss auf "true" gesetzt werden.' });
  },
};
