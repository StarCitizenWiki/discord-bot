const { SlashCommandBuilder } = require('discord.js');

const requestData = require('../lib/request/person/request-person-semantic-data');
const requestLinkData = require('../lib/request/person/request-person-links');
const requestImage = require('../lib/request/request-image');
const createLinkEmbed = require('../lib/embed/person/person-links-embed');
const createLinkDTO = require('../lib/dto/person/person-links-api-dto');
const createDTO = require('../lib/dto/person/person-api-dto');
const createEmbed = require('../lib/embed/person/person-embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('person')
    .setDescription('Erzeugt eine Informationskarte zu einer bestimmten Person.')
    .addStringOption((option) => option.setName('name').setDescription('Ausgabe der Informationen einer Person.'))
    .addIntegerOption((option) => option.setName('seite').setDescription('Ändern der Seite, bei Ausgabe aller Personen.')),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.options.getInteger('seite') || interaction.options.getString('name') === null) {
      const data = await requestLinkData(interaction.options.getInteger('seite'));
      return interaction.editReply({ embeds: [createLinkEmbed(createLinkDTO(data))] });
    }

    const name = interaction.options.getString('name').split(' ').map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const result = await requestData(name);

    if (result === null) {
      throw {
        code: 404,
        response: {
          status: 404,
        },
      };
    }

    const image = await requestImage(name);

    const dto = createDTO(Object.entries(result)[0][1]);

    return interaction.editReply({ embeds: [createEmbed(dto, image)] });
  },
};
