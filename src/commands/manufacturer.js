const { SlashCommandBuilder } = require('discord.js');

const requestData = require('../lib/request/manufacturer/request-manufacturer');
const requestImage = require('../lib/request/request-image');
const createEmbed = require('../lib/embed/manufacturer/manufacturer-embed');
const createLinkEmbed = require('../lib/embed/manufacturer/manufacturer-links-embed');
const createDTO = require('../lib/dto/manufacturer/manufacturer-api-dto');
const createLinkDTO = require('../lib/dto/manufacturer/manufacturer-links-api-dto');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hersteller')
    .setNameLocalizations({
      'en-US': 'manufacturer',
      fr: 'producteur',
    })
    .setDescription('Erzeugt eine Informationskarte zu einem bestimmten Hersteller.')
    .setDescriptionLocalizations({
      'en-US': 'Creates an information card about a specific manufacturer.',
      fr: 'Crée une carte d\'information sur un producteur spécifique.',
    })
    .addStringOption((option) => option.setName('name')
      .setNameLocalizations({
        fr: 'nom',
      })
      .setDescription('Name des Herstellers.')
      .setDescriptionLocalizations({
        'en-US': 'Name of the manufacturer.',
        fr: 'Nom du producteur.',
      })),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const name = interaction.options.getString('name');

    if (name === null) {
      const data = await requestData('');

      return interaction.editReply({ embeds: [createLinkEmbed(createLinkDTO(data), interaction)] });
    }

    const result = await requestData(name);
    const image = await requestImage(name);

    return interaction.editReply({ embeds: [createEmbed(createDTO(result, image), interaction)] });
  },
};
