const { SlashCommandBuilder } = require('discord.js');

const requestData = require('../lib/request/galactapedia/request-galactapedia');
const createDTO = require('../lib/dto/galactapedia/galactapedia-api-dto');
const createEmbed = require('../lib/embed/galactapedia/galactapedia-embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('galactapedia')
    .setDescription('Erzeugt eine Informationskarte zu einem bestimmten Galactapedia Artikel.')
    .addStringOption((option) => option
      .setName('suche')
      .setAutocomplete(true)
      .setDescription('Auflistung des ersten Artikels der zum Suchwort passt.')
      .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const result = await requestData(interaction.options.getString('suche'));

    if (result === null) {
      throw {
        code: 404,
        response: {
          status: 404,
        },
      };
    }

    await interaction.editReply({ embeds: [createEmbed(createDTO(result))] });
  },
};
