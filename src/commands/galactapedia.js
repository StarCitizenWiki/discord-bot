const { SlashCommandBuilder } = require('discord.js');

const requestData = require('../lib/request/galactapedia/request-galactapedia');
const createDTO = require('../lib/dto/galactapedia/galactapedia-api-dto');
const createEmbed = require('../lib/embed/galactapedia/galactapedia-embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('galactapedia')
    .setDescription('Erzeugt eine Informationskarte zu einem bestimmten Galactapedia Artikel.')
    .setDescriptionLocalizations({
      'en-US': 'Creates an information card about a specific Galactapedia article.',
      fr: 'Crée une fiche d\'information sur un article spécifique de Galactapedia.',
    })
    .addStringOption((option) => option
      .setName('search')
      .setNameLocalizations({
        de: 'suche',
        fr: 'chercher',
      })
      .setAutocomplete(true)
      .setDescription('Auflistung des ersten Artikels der zum Suchwort passt.')
      .setDescriptionLocalizations({
        'en-US': 'Listing of the first article that matches the search term.',
        fr: 'Liste du premier article correspondant au mot recherché.',
      })
      .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const result = await requestData(interaction);

    if (result === null) {
      throw {
        code: 404,
        response: {
          status: 404,
        },
      };
    }

    await interaction.editReply({ embeds: [createEmbed(createDTO(result), interaction)] });
  },
};
