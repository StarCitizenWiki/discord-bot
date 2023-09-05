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
    .setNameLocalizations({
      fr: 'personne',
    })
    .setDescription('Erzeugt eine Informationskarte zu einer bestimmten Person.')
    .setDescriptionLocalizations({
      'en-US': 'Creates an information card about a specific person.',
      fr: 'Crée une fiche d\'information sur une personne donnée.',
    })
    .addStringOption((option) => option.setName('name')
      .setNameLocalizations({
        'en-US': 'name',
        fr: 'nom',
      })
      .setDescription('Ausgabe der Informationen einer Person.')
      .setDescriptionLocalizations({
        'en-US': 'Output of a person\'s information.',
        fr: 'Sortie des informations d\'une personne.',
      }))
    .addIntegerOption((option) => option.setName('seite')
      .setNameLocalizations({
        'en-US': 'page',
        fr: 'page',
      })
      .setDescription('Ändern der Seite, bei Ausgabe aller Personen.')
      .setDescriptionLocalizations({
        'en-US': 'Change the page, when outputting all people.',
        fr: 'Modifier la page, à la sortie de toutes les personnes.',
      })),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<boolean|void>}
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    if (interaction.options.getInteger('seite') || interaction.options.getString('name') === null) {
      const data = await requestLinkData(interaction.options.getInteger('seite'));
      return interaction.editReply({ embeds: [createLinkEmbed(createLinkDTO(data), interaction)] });
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

    return interaction.editReply({ embeds: [createEmbed(dto, image, interaction)] });
  },
};
