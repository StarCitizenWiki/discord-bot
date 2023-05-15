const { SlashCommandBuilder } = require('@discordjs/builders');

const requestData = require('../lib/request/manufacturer/request-manufacturer');
const requestImage = require('../lib/request/request-image');
const createEmbed = require('../lib/embed/manufacturer/manufacturer-embed');
const createLinkEmbed = require('../lib/embed/manufacturer/manufacturer-links-embed');
const createDTO = require('../lib/dto/manufacturer/manufacturer-api-dto');
const createLinkDTO = require('../lib/dto/manufacturer/manufacturer-links-api-dto');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hersteller')
    .setDescription('Erzeugt eine Informationskarte zu einem bestimmten Hersteller.')
    .addStringOption((option) => option.setName('name').setDescription('Name des Herstellers.')),
  /**
   * @param {CommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const name = interaction.options.getString('name');

    if (name === null) {
      const data = await requestData('');

      return interaction.editReply({ embeds: [createLinkEmbed(createLinkDTO(data))] });
    }

    const result = await requestData(name);
    const image = await requestImage(name);

    return interaction.editReply({ embeds: [createEmbed(createDTO(result, image))] });
  },
};
