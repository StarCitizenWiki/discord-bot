const { SlashCommandBuilder } = require('discord.js');

const requestData = require('../lib/request/item/request-item');
const createItemDto = require('../lib/dto/item/item-api-dto');
const createItemEmbed = require('../lib/embed/item/item-embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('item')
    .setDescription('Informationen zu allen Items aus Star Citizen.')
    .setDescriptionLocalizations({
      'en-US': 'Information about all items in Star Citizen.',
      fr: 'Informations sur tous les objets de Star Citizen.',
    })
    .addStringOption((option) => option
      .setName('name')
      .setNameLocalizations({
        fr: 'nom',
      })
      .setDescription('Name des Items.')
      .setDescriptionLocalizations({
        'en-US': 'Name of the item.',
        fr: 'Nom de l\'item.',
      })
      .setAutocomplete(true)
      .setRequired(true)),
  /**
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<boolean|void>}
     */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const name = interaction.options.getString('name');
    const reply = await requestData(name, interaction);

    return interaction.editReply({ embeds: [createItemEmbed(createItemDto(reply), interaction)] });
  },
};
