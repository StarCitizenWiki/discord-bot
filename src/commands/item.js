const { SlashCommandBuilder } = require('discord.js');

const requestData = require('../lib/request/item/request-item');
const createItemDto = require('../lib/dto/item/item-api-dto');
const createItemEmbed = require('../lib/embed/item/item-embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('item')
    .setDescription('Informationen zu allen Items aus Star Citizen.')
    .addStringOption((option) => option
      .setName('name')
      .setDescription('Name des Items.')
      .setAutocomplete(true)
      .setRequired(true)),
  /**
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<boolean|void>}
     */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const name = interaction.options.getString('name');
    const reply = await requestData(name);

    return interaction.editReply({ embeds: [createItemEmbed(createItemDto(reply))] });
  },
};
